#ifdef __APPLE__
  #include <GLUT/glut.h>
#else
  #include <GL/glut.h>
#endif
#include <stdlib.h>
#include <cmath>
#include <thread>
#include <chrono>

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

void update_coords() {
  while (1) {
    client->getCoordinates(LEFT_RIGHT, UP_DOWN, IN_OUT);
      // std::cout << "X: " << LEFT_RIGHT << " Y: " << UP_DOWN << " Z: " << IN_OUT << std::endl; 
    // std::this_thread::sleep_for (std::chrono::milliseconds(30));
  }
}

void camera_init (void)
{
  while (1) {
    camera->getCoordinates (client);
    // std::this_thread::sleep_for (std::chrono::milliseconds(30));
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
   glutIdleFunc(glutPostRedisplay);
   glutReshapeFunc(reshape);
   init();

   std::thread cam_thread (camera_init);
   std::thread idle_thread (update_coords);

   glutMainLoop();
   cam_thread.join();
   idle_thread.join(); 
   return 0;
}
