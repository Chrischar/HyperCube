#include "client.h"
#include "camera.h"
#include <cmath>
#include <iostream>
using namespace std;

#define INSTABILITY_CONSTANT 0.6

Client::Client(void)
{
    x = 0.0;
    y = 0.0;
    z = 0.0;
    angle = 0.0;
}

void Client::setCoordinates(double x, double y, int width)
{
    this->x = INSTABILITY_CONSTANT * x + (1 - INSTABILITY_CONSTANT) * this->x;
    this->y = INSTABILITY_CONSTANT * y + (1 - INSTABILITY_CONSTANT) * this->y;
    this->z = INSTABILITY_CONSTANT * width + (1 - INSTABILITY_CONSTANT)
        * this->z;
    this->angle = INSTABILITY_CONSTANT * sqrt(x*x + y*y) * width +
        (1 - INSTABILITY_CONSTANT) * this->angle;
}

void Client::getCoordinates(double* x, double* y, double* z, double* angle)
{
    *x = this->x;
    *y = this->y;
    *z = 500.0 / this->z;
    *angle = this->angle;
}
