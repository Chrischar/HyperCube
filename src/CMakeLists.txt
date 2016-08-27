include_directories(
    ${GLUT_INCLUDE_DIRS}
    ${OpenGL_INCLUDE_DIRS}
)

add_executable(HyperCube
    # camera.cpp
    # client.cpp
    main.cpp
)

target_link_libraries(HyperCube
    ${OpenCV_LIBS}
    ${GLUT_LIBRARY}
    ${OPENGL_LIBRARIES}
)
