#ifndef _CLIENT_H_
#define _CLIENT_H_

class Client {
    double x;
    double y;
    double z;
public:
    Client (void);
    ~Client (void);
    void setCoordinates (int x, int y, int width, int height);
    void getCoordinates (double& x, double& y, double& z);
};

#endif
