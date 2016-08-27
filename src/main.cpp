#include "client.h"
#include "camera.h"
#include "screen.h"
#include <thread>
#include <atomic>
#include <chrono>
#include <iostream>
using namespace std;

atomic<bool> running;
Screen* screen;
Camera* camera;
Client* client;

static void screen_loop(void);
static void control_loop(void);

int main(int argc, char** argv)
{
    screen  = new Screen;
    camera  = new Camera;
    client  = new Client;

    running = true;

    thread control_thread(control_loop);

    screen_loop();

    control_thread.join();
    return 0;
}

static void control_loop(void)
{
    while (running) {
        camera->detect_frame(*client);
    }
}

static void screen_loop(void)
{
    double x, y, z;
    do {
        client->getCoordinates(&x, &y, &z);
        running = screen->loop(x, y, z);
    } while (running);
}
