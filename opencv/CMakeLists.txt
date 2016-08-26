cmake_minimum_required (VERSION 2.8)
PROJECT (HyperCube)
find_package (OpenCV REQUIRED)

add_executable (HyperCube test.cpp)
target_link_libraries (HyperCube ${OpenCV_LIBS})
