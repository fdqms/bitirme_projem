cmake_minimum_required( VERSION 3.1 )

project( fdqmschess )

set(CMAKE_CXX_STANDARD 17)

find_package(gRPC CONFIG REQUIRED)

find_package( Protobuf REQUIRED )

find_package(libpqxx CONFIG REQUIRED)

find_package(cpp-jwt CONFIG REQUIRED)

find_package(cryptopp CONFIG REQUIRED)

set(project_sources src/Board.cpp src/Game.cpp src/Piece.cpp src/Vec2.cpp src/server.cpp proto/chess.grpc.pb.cc proto/chess.pb.cc)

add_executable( fdqms_server ${project_sources})

target_link_libraries( fdqms_server PRIVATE gRPC::gpr gRPC::upb gRPC::grpc gRPC::grpc++ gRPC::grpc++_reflection protobuf::libprotoc protobuf::libprotobuf protobuf::libprotobuf-lite libpqxx::pqxx cpp-jwt::cpp-jwt cryptopp-static)