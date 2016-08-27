cmake_minimum_required(VERSION 2.8)
PROJECT(HyperCube)

find_package(OpenCV REQUIRED)
find_package(GLUT REQUIRED)
find_package(OpenGL REQUIRED)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR})

add_subdirectory(src)
