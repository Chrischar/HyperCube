include_directories(
    ${OpenGL_INCLUDE_DIRS}
    ${GLUT_INCLUDE_DIRS}
    ${GLFW_INCLUDE_DIRS}
)

add_executable(HyperCube
    camera.cpp
    client.cpp
    main.cpp
    screen.cpp
)

target_link_libraries(HyperCube
    ${OpenCV_LIBS}
    ${OPENGL_LIBRARIES}
    ${GLFW_LIBRARIES}
    ${GLUT_LIBRARIES}
)
