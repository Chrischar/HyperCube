#ifndef _CLIENT_H_
#define _CLIENT_H_
#include <mutex>

class Client {

    double x;
    double y;
    double z;
    std::mutex my_lock;
public:
    Client (void);
    void setCoordinates(double x, double y, int width);
    void getCoordinates(double* x, double* y, double* z);
};

#endif
