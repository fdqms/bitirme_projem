import Cookies from 'universal-cookie';

const { Position, RegisterRequest, LoginRequest, Empty } = require('./proto/chess_pb');
const { SatrancServiceClient } = require('./proto/chess_grpc_web_pb');

const cookie = new Cookies();

const satrancService = new SatrancServiceClient('http://localhost:8080', null, null);
let stream;

if(cookie.get('token')){
    try {
        stream = satrancService.connect(new Empty(), { "token": cookie.get("token") });
        stream.on('end', function (end) {
            console.log('sonlandırıldı');
        });
    } catch (e) {
    
    }
}

const api = {
    login: async (username, password) => {
        return await new Promise((resolve, reject) => {
            const req = new LoginRequest();
            req.setUsername(username);
            req.setPassword(password);

            satrancService.login(req, {}, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (res.getName().length > 0) {
                        cookie.set("name", res.getName());
                        cookie.set("token", res.getToken());
                        stream = satrancService.connect(new Empty(), { "token": cookie.get("token") });

                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    },

    register: async (name, username, password, mail) => {
        return await new Promise((resolve, reject) => {
            const req = new RegisterRequest();
            req.setName(name);
            req.setEMail(mail);
            req.setUsername(username);
            req.setPassword(password);

            satrancService.register(req, {}, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.getName().length > 0) {
                        cookie.set("name", res.getName());
                        cookie.set("token", res.getToken());
                        stream = satrancService.connect(new Empty(), { "token": cookie.get("token") });
                        stream.on('end', function (end) {
                            console.log('sonlandırıldı');
                        });
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    },

    createGame: async () => {
        return await new Promise((resolve, reject) => {
            satrancService.createGame(new Empty(), { "token": cookie.get("token") }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.getId());
                }
            });
        });
    },

    searchGame: async () => {
        return await new Promise((resolve, reject) => {
            satrancService.searchGame(new Empty(), { "token": cookie.get("token") }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.getId());
                }
            });
        });
    },

    move: async (x, y, x2, y2, gameId) => {
        return await new Promise((resolve, reject) => {
            const position = new Position();
            position.setX(x);
            position.setY(y);
            position.setX2(x2);
            position.setY2(y2);
            position.setGameId(gameId);

            satrancService.move(position, { "token": cookie.get("token") }, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },

    promotion: async (x, y, pieceType, gameId) => {
        return await new Promise((resolve, reject) => {
            const position = new Position();
            position.setX(x);
            position.setY(y);
            position.setPieceType(pieceType);
            position.setGameId(gameId);

            satrancService.promotion(position, { "token": cookie.get("token") }, function (err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

export { stream, api };

// export { stream, login, register, createGame, searchGame, moveAPI };


// stream.cancel()
