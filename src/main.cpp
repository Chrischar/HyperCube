#ifdef __APPLE__
  #include <GLUT/glut.h>
#else
  #include <GL/glut.h>
#endif
#include <stdlib.h>
#include <cmath>
#include <thread>

#include "client.h"
#include "camera.h"

double X = 0;
double IN_OUT = 0;
double LEFT_RIGHT = 0;
double UP_DOWN = 0;

Client* client;
Camera* camera;

void init(void) 
{
   glClearColor(0.0, 0.0, 0.0, 0.0);
   glShadeModel(GL_FLAT);
   client = new Client();
   camera = new Camera(client);
}

void display(void)
{
   glClear (GL_COLOR_BUFFER_BIT);
   glColor3f (1.0, 1.0, 1.0);
   glLoadIdentity();
   gluLookAt(0.0 + LEFT_RIGHT, 0.0 + UP_DOWN, 5.0 + IN_OUT, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
   glutWireCube (1.0);
   glutSwapBuffers();

}

void reshape (int w, int h)
{
   glViewport (0, 0, (GLsizei) w, (GLsizei) h); 
   glMatrixMode (GL_PROJECTION);
   glLoadIdentity ();
   glFrustum (-1.0, 1.0, -1.0, 1.0, 1.5, 20.0);
   glMatrixMode (GL_MODELVIEW);
}

void idle() {
  X += 0.05;
  IN_OUT = std::sin(X);
  UP_DOWN = std::sin(X);
  LEFT_RIGHT = std::sin(X);
  client->getCoordinates(LEFT_RIGHT, UP_DOWN, IN_OUT);
  glutPostRedisplay();
}

void camera_init (void)
{
  while (1) {
    camera->getCoordinates (client);
  }
}

int main(int argc, char** argv)
{
   glutInit(&argc, argv);
   glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
   glutInitWindowSize (500, 500); 
   glutInitWindowPosition (100, 100);
   glutCreateWindow (argv[0]);
   glutDisplayFunc(display); 
   glutReshapeFunc(reshape);
   glutIdleFunc(idle);
   init();

   std::thread cam_thread (camera_init);

   glutMainLoop();
   cam_thread.join();
   return 0;
}
