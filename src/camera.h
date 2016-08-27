#include "opencv2/objdetect.hpp"                                               
#include "opencv2/imgproc.hpp"
#include <iostream>

#ifndef _CAMERA_H_
#define _CAMERA_H_

#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 480
#define SCREEN_DEPTH 640

class Camera {
    String face_cascade_file    = "resources/haarcascade_frontalface_alt.xml";
    static int setup_cascade(CascadeClassifier& face_cascad);                       
    static int setup_captuZZre(VideoCapture& capture);                                
    static void detectFrame(Mat frame, CascadeClassifier& face_cascade);

    // private variables and/or methods
public:

    Camera (void);
    ~Camera (void);
};

#endif
