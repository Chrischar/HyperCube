#include "client.h"
#include "camera.h"
#include <cmath>

Client::Client(void)
{
    x = 0.0;
    y = 0.0;
    z = 0.0;
}

Client::~Client(void)
{
}

void Client::setCoordinates(int x, int y, int width, int height)
{
    double r = 1 / width;
    x = (SCREEN_WIDTH / 2) - x;
    y = (SCREEN_HEIGHT / 2) - y;
    double theta    = std::atan2(x, SCREEN_DEPTH);
    double phi      = std::atan2(y, SCREEN_DEPTH);
    this->x = r * std::sin(theta);
    this->y = r * std::sin(phi);
    this->z = r; // * std::sqrt(r*r - x*x - y*y);
}

void Client::getCoordinates(double& x, double& y, double& z)
{
    x = this->x;
    y = this->y;
    z = this->z;
}
