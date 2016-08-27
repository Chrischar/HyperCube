cmake_minimum_required (VERSION 2.8)
PROJECT (HyperCube)
find_package (OpenCV REQUIRED)

set (CMAKE_CXX_STANDARD 14)

add_executable (HyperCube
		camera.cpp)
target_link_libraries (HyperCube ${OpenCV_LIBS})
