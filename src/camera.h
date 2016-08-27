#include "client.h"
#include "opencv2/objdetect.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc.hpp"
#include <iostream>

using namespace cv;

#ifndef _CAMERA_H_
#define _CAMERA_H_

#define SCREEN_WIDTH 480
#define SCREEN_HEIGHT 360
#define SCREEN_DEPTH 480

class Camera {
    // variables
    CascadeClassifier face_cascade;
    String face_cascade_file;
    VideoCapture capture;
    Mat frame;
    // functions
    int setup_cascade(void);
    int setup_capture(void);
public:
    Camera (void);
    ~Camera (void);
    void getCoordinates(Client& client);
};

#endif
