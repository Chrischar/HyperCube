#ifndef _SERVER_H_
#define _SERVER_H_

class Server {
    double x;
    double y;
    double z;
public:
    Server (void);
    ~Server (void);
    void setCoordinates (int x, int y, int width, int height);
    void getCoordinates (double& x, double& y, double& z);
};

#endif
