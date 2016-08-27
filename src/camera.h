#ifndef _CAMERA_H_
#define _CAMERA_H_

#include "client.h"
#include "opencv2/objdetect.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc.hpp"

#define SCREEN_WIDTH 480
#define SCREEN_HEIGHT 360

class Camera {
    std::string face_cascade_file;
    std::string window_name;
    cv::CascadeClassifier face_cascade;
    cv::VideoCapture capture;
    cv::Mat frame;
    bool setup_cascade(void);
    bool setup_capture(void);
public:
    Camera (void);
    void detect_frame(Client& client);
};

#endif
