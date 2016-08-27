#include "screen.h"
#include <GLUT/glut.h>
#include <iostream>
using namespace std;

void Screen::error_callback(int error, const char* description)
{
    cerr << description << endl;
}

void Screen::key_callback(GLFWwindow* window, int key, int scancode, int action,
        int mode)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS) {
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
}

Screen::Screen(void)
{
    glfwSetErrorCallback(error_callback);

    if (!glfwInit()) {
        return;
    }

    window = glfwCreateWindow(640, 480, "Simple Example", NULL, NULL);
    if (!window) {
        glfwTerminate();
        return;
    }

    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);
}

Screen::~Screen(void)
{
    glfwDestroyWindow(window);
    glfwTerminate();
}

bool Screen::loop(double x, double y, double z)
{
    glfwMakeContextCurrent(window);
    glClear(GL_COLOR_BUFFER_BIT);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glTranslatef(0, 0, 1);
    glRotatef(z, -y, x, 0);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    glColor3f(0, 1, 0);
    glBegin(GL_QUADS);
        glVertex3f(-1,-1, 1);
        glVertex3f( 1,-1, 1);
        glVertex3f( 1, 1, 1);
        glVertex3f(-1, 1, 1);
    glEnd();

    glColor3f(1, 0, 0);
    glutWireTeapot(0.7);

    glfwSwapBuffers(window);
    glfwPollEvents();

    if (glfwWindowShouldClose(window)) {
        return false;
    }
    return true;
}
