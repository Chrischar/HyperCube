#ifndef _SCREEN_H_
#define _SCREEN_H_

#define GLFW_INCLUDE_GLU
#include <GLFW/glfw3.h>

class Screen {
    GLFWwindow* window;
    static void error_callback(int error, const char* description);
    static void key_callback(GLFWwindow* window, int key, int scancode, int action,
            int mode);
public:
    Screen(void);
    ~Screen(void);
    bool loop(double x, double y, double z);
};

#endif
