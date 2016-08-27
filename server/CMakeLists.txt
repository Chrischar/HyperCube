cmake_minimum_required (VERSION 2.8)
PROJECT (HyperCubeServer)

set (CMAKE_CXX_STANDARD 14)

add_executable (HyperCubeServer
    connect.c
    server.cpp
)
