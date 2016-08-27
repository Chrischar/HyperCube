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
    ~Client (void);
    void setCoordinates (int x, int y, int width, int height);
    void getCoordinates (double& x, double& y, double& z);
};

#endif
