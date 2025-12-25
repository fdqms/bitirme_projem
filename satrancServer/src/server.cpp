
#include <iostream>
#include <memory>
#include <string>
#include <map>
#include <iterator>
#include <cstdlib>

#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>
#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <google/protobuf/util/message_differencer.h>

#include "../proto/chess.grpc.pb.h"

#include <pqxx/pqxx>
#include <pqxx/nontransaction>

#include <cryptopp/cryptlib.h>
#include <cryptopp/hex.h>
#include <cryptopp/sha.h>
#include <cryptopp/filters.h>

#include <jwt/jwt.hpp>

#include "Game.h"

using fdqms::Empty;
using fdqms::GameID;
using fdqms::LoginRequest;
using fdqms::Position;
using fdqms::RegisterRequest;
using fdqms::Result;
using fdqms::SatrancService;
using fdqms::User;

using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::ServerWriter;
using grpc::Status;

using namespace std;
using namespace pqxx;
using namespace CryptoPP;

using namespace jwt::params;

const string dbSettings = "dbname=satranc user=fdqms password=123456 hostaddr=127.0.0.1 port=5432";
const string privateKey = "cok onemli anahtar";

map<int64_t, Game> games;
map<int64_t, ServerWriter<Position> *> connectedUsers;

void hashing(string input, string &output)
{
    CryptoPP::SHA256 hash;
    input.append("fdqms-salt");
    StringSource(input, true, new HashFilter(hash, new HexEncoder(new StringSink(output))));
}

class SatrancServiceImpl final : public SatrancService::Service
{

    Status Login(ServerContext *context, const LoginRequest *req, User *user) override
    {

        connection C(dbSettings);
        work W(C);

        if (C.is_open())
        {
            try
            {
                result res = W.exec("SELECT p_name, p_id, p_password FROM players WHERE p_username='{" + req->username() + "}' LIMIT 1;");
                W.commit();

                string hashedPassword;
                hashing(req->password(), hashedPassword);

                hashedPassword.insert(0, 1, '{');
                hashedPassword.push_back('}');

                if (res[0][0].size() > 0)
                {
                    bool valid = string(res[0][2].c_str()).compare(hashedPassword) == 0;
                    if (valid)
                    {
                        string name = string(res[0][0].c_str());
                        name = name.substr(1, name.length() - 2);
                        user->set_name(name);
                        jwt::jwt_object obj{algorithm("HS256"), payload({{"id", res[0][1].c_str()}}), secret(privateKey)};
                        user->set_token(obj.signature());
                    }
                }
            }
            catch (exception &e)
            {
                cout << "hata: " << e.what() << endl;
            }
            C.close();
        }

        return Status::OK;
    }

    Status Register(ServerContext *context, const RegisterRequest *req, User *user) override
    {

        string hashedPassword;

        hashing(req->password(), hashedPassword);

        connection C(dbSettings);
        work W(C);

        if (C.is_open())
        {
            pqxx::result sqlRes = W.exec(_strdup(string("INSERT INTO players (p_name,p_email,p_username,p_password) VALUES ('{" + to_string(req->name()) + "}','{" + to_string(req->e_mail()) + "}','{" + to_string(req->username()) + "}','{" + hashedPassword + "}') RETURNING p_id").c_str()));
            W.commit();
            jwt::jwt_object obj{algorithm("HS256"), payload({{"id", sqlRes[0][0].as<string>()}}), secret(privateKey)};
            user->set_token(obj.signature());
            user->set_name(req->name());
            C.close();
        }

        return Status::OK;
    }

    Status Connect(ServerContext *context, const fdqms::Empty *request, ServerWriter<Position> *writer) override
    {
        const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
        std::error_code ec;

        try
        {
            auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
            int64_t id = stoll(dec.payload().get_claim_value<string>("id"));

            cout << "baglanan oyuncu: " << id << endl;

            connectedUsers.insert({id, writer});

            while (!context->IsCancelled())
                ;

            connectedUsers.erase(id);
        }
        catch (std::exception &e)
        {
            cout << "connect hatasi" << endl;
            cout << ec << endl;
            cout << e.what() << endl;
        }

        return Status::CANCELLED;
    }

    Status Move(ServerContext *context, const Position *req, Result *res) override
    {
        map<int64_t, Game>::iterator it = games.find(req->game_id());

        cout << "oynaniyor..." << endl;
        cout << "oyun sayisi: " << games.size() << endl;

        cout << "aranan oyun: " << req->game_id() << endl;

        if (it == games.end())
        {
            cout << "oyun bulunamadi" << endl;

            res->set_successful(false);

            return Status::OK;
        }
        else
        {
            cout << "oyun bulundu" << endl;

            const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
            std::error_code ec;
            auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
            int64_t p1_id = stoll(dec.payload().get_claim_value<std::string>("id"));
            int64_t p2_id;

            if (it->second.getPlayer1() == p1_id && it->second.board->getOrderColor())
            {
                p2_id = it->second.getPlayer2();
                cout << "oyuncu yeterli yetkiye sahip. oyuncu id: " << p2_id << endl;
            }
            else if (it->second.getPlayer2() == p1_id && !it->second.board->getOrderColor())
            {
                p2_id = it->second.getPlayer1();
                cout << "oyuncu yeterli yetkiye sahip. oyuncu id: " << p2_id << endl;
            }
            else
            {
                res->set_successful(false);
                cout << "oyuncu yeterli yetkiye sahip degil" << endl;
                return Status::OK;
            }

            // connection C(dbSettings);
            // work W(C);
            connection C(dbSettings);
            work W(C);

            bool a = it->second.board->move(req->x(), req->y(), req->x2(), req->y2());

            if (a)
            {

                try
                {
                    char *sql;
                    sql = _strdup(string("INSERT INTO moves(g_id, m_notation, p_id) VALUES(" + to_string(req->game_id()) + ",'{" + to_string(req->x()) + to_string(req->y()) + to_string(req->x2()) + to_string(req->y2()) + "}', " + to_string(p1_id) + ");").c_str());

                    cout << "oynama basarili" << endl;

                    W.exec(sql);
                    W.commit();

                    free(sql);

                    map<int64_t, ServerWriter<Position> *>::iterator p_it = connectedUsers.find(p2_id);

                    if (it->second.board->getOrderColor())
                    {
                        it->second.board->setBlackTime();
                    }
                    else
                    {
                        it->second.board->setWhiteTime();
                    }

                    const_cast<Position *>(req)->set_b_rem_time(it->second.board->getBlackTime());
                    const_cast<Position *>(req)->set_w_rem_time(it->second.board->getWhiteTime());

                    // maçı izleyen tüm kullanıcılara iletilecek şeklinde düzenlenecek
                    if (p_it != connectedUsers.end())
                    {

                        p_it->second->Write(*req); // ikinci oyuncu oyundaysa ilet

                        cout << "ikinci oyuncuya veriler iletildi" << endl;
                    }
                    else
                    {
                        cout << "ikinci oyuncu bagli degil" << endl;
                    }

                    res->set_w_rem_time(it->second.board->getWhiteTime());
                    res->set_b_rem_time(it->second.board->getBlackTime());
                    res->set_successful(true);
                }
                catch (exception &e)
                {
                    std::cout << "move hatasi" << e.what() << std::endl;
                    res->set_successful(false);
                }
            }
            else
            {
                cout << "basarisiz oynama" << endl;
                res->set_successful(false);
            }

            C.close();
            // C.close();

            return Status::OK;
        }
    }

    Status Promotion(ServerContext *context, const Position *req, fdqms::Empty *res) override
    {
        cout << "promotion" << endl;

        map<int64_t, Game>::iterator it = games.find(req->game_id());

        if (it == games.end())
        {
            cout << "oyun bulunamadi | prom" << endl;

            return Status::OK;
        }
        else
        {

            const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
            std::error_code ec;

            connection C(dbSettings);
            work W(C);

            if (it->second.board->promotion(req->x(), req->y(), req->piece_type()))
            {
                try
                {
                    auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
                    string id = dec.payload().get_claim_value<std::string>("id");

                    if (C.is_open())
                    {
                        char *sql;
                        sql = _strdup(string("INSERT INTO moves(g_id, m_notation, p_id) VALUES(" + to_string(req->game_id()) + ",'{" + to_string(req->x()) + to_string(req->y()) + to_string(req->piece_type()) + "9}', " + id + ");").c_str());
                        W.exec(sql);
                        W.commit();
                        free(sql);

                        map<int64_t, ServerWriter<Position> *>::iterator p_it;
                        if (it->second.getPlayer1() == stoll(id))
                        {
                            p_it = connectedUsers.find(it->second.getPlayer2());
                        }
                        else if (it->second.getPlayer2() == stoll(id))
                        {
                            p_it = connectedUsers.find(it->second.getPlayer1());
                        }

                        if (p_it == connectedUsers.end())
                        {
                            cout << "oyuncu bulunamadi" << endl;
                        }
                        else
                        {
                            p_it->second->Write(*req);
                        }
                    }
                }
                catch (std::exception &e)
                {
                    cout << "decode hatasi: " << ec << endl;
                    cout << "hata: " << e.what() << endl;
                }

                C.close();
            }

            return Status::OK;
        }
    }

    Status CreateGame(ServerContext *context, const fdqms::Empty *request, GameID *response) override
    {

        cout << "oyun olusturuluyor..." << endl;

        const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
        std::error_code ec;

        connection C(dbSettings);
        work W(C);

        try
        {
            auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
            string id = dec.payload().get_claim_value<std::string>("id");

            if (C.is_open())
            {
                pqxx::result sqlRes = W.exec(_strdup(string("INSERT INTO games (g_p1, g_type, g_start_date) VALUES (" + id + ", 0, NOW()) RETURNING g_id").c_str()));
                W.commit();

                int64_t gameId = sqlRes[0][0].as<int64_t>();
                games.insert({gameId, Game(stoll(id))});

                response->set_id(gameId);

                cout << "oyun olusturuldu. oyun id: " << gameId << endl;
            }
        }
        catch (std::exception &e)
        {
            response->set_id(-1);
            cout << "decode hatasi: " << ec << endl;
            cout << "hata: " << e.what() << endl;
        }

        C.close();

        return Status::OK;
    }

    Status SearchGame(ServerContext *context, const fdqms::Empty *request, fdqms::GameID *response) override
    {

        cout << "oyun araniyor..." << endl;

        const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
        std::error_code ec;

        connection C(dbSettings);
        work W(C);

        try
        {
            auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
            string id = dec.payload().get_claim_value<std::string>("id");

            int64_t gameId = -1;

            for (map<int64_t, Game>::iterator i = games.begin(); i != games.end(); ++i)
            {
                if (i->second.getPlayer2() < 0)
                {
                    i->second.setPlayer2(stoll(id));
                    gameId = i->first;

                    cout << "oyun bulundu. oyun id: " << gameId << endl;
                    break;
                }
            }

            if (gameId > 0)
            {
                pqxx::result sqlRes = W.exec(_strdup(string("UPDATE games SET g_p2=" + id + " WHERE g_id=" + to_string(gameId) + " RETURNING g_p1").c_str()));
                W.commit();
                int64_t p1_id = sqlRes[0][0].as<int64_t>();

                response->set_id(gameId);

                // diğer parametreleri göndermediğinde 1. oyuncu 2. oyuncunun oyuna bağlandığını anlayacak.

                map<int64_t, ServerWriter<Position> *>::iterator it = connectedUsers.find(p1_id);

                if (it == connectedUsers.end())
                {
                    cout << "kullanici bulunamadi" << endl;

                    cout << connectedUsers.size() << endl;
                }
                else
                {
                    Position position = Position();
                    position.set_game_id(gameId);
                    it->second->Write(position);
                }
            }
        }
        catch (std::exception &e)
        {
            cout << ec << endl;
            cout << "hata: " << e.what() << endl;
        }

        C.close();

        return Status::OK;
    }

    Status LeaveGame(ServerContext *context, const fdqms::GameID *request, fdqms::Empty *response)
    {
        const std::multimap<grpc::string_ref, grpc::string_ref> metadata = context->client_metadata();
        std::error_code ec;

        connection C(dbSettings);
        work W(C);

        if (C.is_open())
        {
            try
            {
                auto dec = jwt::decode(string(metadata.find("token")->second.begin(), metadata.find("token")->second.end()), algorithms({"HS256"}), ec, secret(privateKey));
                string id = dec.payload().get_claim_value<std::string>("id");

                map<int64_t, Game>::iterator it = games.find(request->id());

                if (it != games.end())
                {
                    if (stoll(id) == it->second.getPlayer1())
                    {
                        W.exec(_strdup(string("UPDATE games SET g_winner=" + to_string(it->second.getPlayer2()) + ", g_finish_date=NOW() WHERE g_id=" + to_string(it->first) + "").c_str()));
                        W.commit();

                        games.erase(it);
                    }
                    else if (stoll(id) == it->second.getPlayer2())
                    {
                        W.exec(_strdup(string("UPDATE games SET g_winner=" + to_string(it->second.getPlayer1()) + ", g_finish_date=NOW() WHERE g_id=" + to_string(it->first) + "").c_str()));
                        W.commit();

                        games.erase(it);
                    }
                }
            }
            catch (std::exception &e)
            {
                cout << ec << endl;
                cout << "hata: " << e.what() << endl;
            }
        }
        return Status::OK;
    }
};

void RunServer()
{

    std::string server_address("0.0.0.0:50051");
    SatrancServiceImpl service;

    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;

    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());

    builder.RegisterService(&service);

    std::unique_ptr<Server> server(builder.BuildAndStart());
    std::cout << "Sunucu " << server_address << " adresinde baslatildi" << std::endl;

    server->Wait();
}

int main(int argc, char **argv)
{

    RunServer();

    return 0;
}