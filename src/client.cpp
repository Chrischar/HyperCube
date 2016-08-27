#include "client.h"
#include "camera.h"
#include <cmath>
#include <iostream>
using namespace std;

Client::Client(void)
{
    x = 0.0;
    y = 0.0;
    z = 0.0;
}

void Client::setCoordinates(double x, double y, int width)
{
    this->x = x / SCREEN_WIDTH;
    this->y = y / SCREEN_HEIGHT;
    this->z = 360 / 3.14 * asin (width * sqrt(x*x + y*y) / 50);
}

void Client::getCoordinates(double* x, double* y, double* z)
{
    *x = this->x;
    *y = this->y;
    *z = this->z;
}
