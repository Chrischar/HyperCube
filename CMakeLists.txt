cmake_minimum_required(VERSION 2.8)
PROJECT(HyperCube)

find_package(OpenCV REQUIRED)
find_package(GLUT REQUIRED)
find_package(OpenGL REQUIRED)

set(CMAKE_CXX_STANDARD 14)

include_directories(
    ${GLUT_INCLUDE_DIRS}
    ${OpenGL_INCLUDE_DIRS}
)

add_executable(HyperCube
    camera.cpp
    server.cpp
    main.cpp
)

target_link_libraries(HyperCube
    ${OpenCV_LIBS}
    ${GLUT_LIBRARY}
    ${OPENGL_LIBRARIES}
)
