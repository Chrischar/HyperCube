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

    window = glfwCreateWindow(1920, 1200, "Simple Example", NULL, NULL);
    if (!window) {
        glfwTerminate();
        return;
    }

    glfwMakeContextCurrent(window);

   GLfloat mat_specular[] = { 1.0, 1.0, 1.0, 1.0 };
   GLfloat mat_shininess[] = { 50.0 };
   GLfloat light_position[] = { 1.0, 1.0, 1.0, 0.0 };
   glClearColor (0.0, 0.0, 0.0, 0.0);
   glShadeModel (GL_SMOOTH);

   glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
   glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess);
   glLightfv(GL_LIGHT0, GL_POSITION, light_position);

   glEnable(GL_LIGHTING);
   glEnable(GL_LIGHT0);
   glEnable(GL_DEPTH_TEST);

    glfwSetKeyCallback(window, key_callback);
}

Screen::~Screen(void)
{
    glfwDestroyWindow(window);
    glfwTerminate();
}

bool Screen::loop(double x, double y, double z, double angle)
{
    glfwMakeContextCurrent(window);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(30, 1920.0 / 1200, 1, 5);
    // glOrtho(-1, 1, -1, 1, -3, 3);
    glRotatef(-angle, y, -x, 0);
    glTranslatef(0, 0, -z);

    draw();

    glfwSwapBuffers(window);
    glfwPollEvents();

    if (glfwWindowShouldClose(window)) {
        return false;
    }
    return true;
}

void Screen::draw(void)
{
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    glColor3f(1, 0, 0);
    glutSolidTeapot(0.7);

    glColor3f(0, 1, 0);
}
