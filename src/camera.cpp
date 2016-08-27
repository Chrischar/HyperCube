#include "camera.h"
#include "client.h"
#include <iostream>
using namespace std;
using namespace cv;

Camera::Camera(void)
{
    face_cascade_file   = "resources/haarcascade_frontalface_alt.xml";
    window_name         = "Face Detection";
    if (!setup_cascade()) {
        cout << "Error: Cascade." << endl;
        return;
    }
    if (!setup_capture()) {
        cout << "Error: Capture." << endl;
        return;
    }
}

bool Camera::setup_cascade(void)
{
    if (!face_cascade.load(face_cascade_file)) {
        return false;
    }
    return true;
}

bool Camera::setup_capture(void)
{
    if (!capture.open(-1)) {
        return -1;
    }
    capture.set(CV_CAP_PROP_FRAME_WIDTH, SCREEN_WIDTH);
    capture.set(CV_CAP_PROP_FRAME_HEIGHT, SCREEN_HEIGHT);
    return true;
}

void Camera::detect_frame(Client& client)
{
    capture.read(frame);
    vector<Rect> faces;
    Mat frame_gray;

    cvtColor(frame, frame_gray, COLOR_BGR2GRAY);
    equalizeHist(frame_gray, frame_gray);

    face_cascade.detectMultiScale(frame_gray, faces, 1.1, 2,
            CASCADE_SCALE_IMAGE, Size(30, 30));

    if (faces.size() == 0) {
        return;
    }

    Rect biggest_face;
    int size = 0;
    for (auto& face: faces) {
        if (face.width > size) {
            size            = face.width;
            biggest_face    = face;
        }
    }

    double x = biggest_face.x + 0.5 * biggest_face.width;
    double y = biggest_face.y + 0.5 * biggest_face.height;

    x -= SCREEN_WIDTH / 2;
    y -= SCREEN_HEIGHT / 2;

    client.setCoordinates(x, y, biggest_face.width);
}
