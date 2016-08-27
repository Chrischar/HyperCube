#include "camera.h"

#include <iostream>

using namespace std;

Camera::Camera(Client* client)
{
    face_cascade_file = "resources/haarcascade_frontalface_alt.xml";
    CascadeClassifier face_cascade;

    if (!setup_cascade()) {
        return;
    }

    VideoCapture capture;

    if (!setup_capture()) {
        return;
    }

    capture.set(CV_CAP_PROP_FRAME_WIDTH, SCREEN_WIDTH);
    capture.set(CV_CAP_PROP_FRAME_HEIGHT, SCREEN_DEPTH);

}

int Camera::setup_cascade(void)
{
    if (!face_cascade.load(face_cascade_file)) {
        cout << "Could not load face cascade." << endl;
        return 0;
    }

    return 1;
}

int Camera::setup_capture()
{
    capture.open(-1);
    if (!capture.isOpened()) {
        cout << "Error opening video capture." << endl;
        return 0;
    }

    return 1;
}

void Camera::getCoordinates(Client* client)
{
    capture.read(frame);
    vector<Rect> faces;
    Mat frame_gray;

    cvtColor(frame, frame_gray, COLOR_BGR2GRAY);
    equalizeHist(frame_gray, frame_gray);

    // detect face
    face_cascade.detectMultiScale(frame_gray, faces, 1.1, 2,
            CASCADE_SCALE_IMAGE, Size(30, 30));

    //checks for no faces
    if (faces.size() == 0) {
        return;
    }


    // for each face
    Rect biggest_face;
    int size = 0;
    for (auto& face: faces) {
        if (face.width > size) {
            size = face.width;
            biggest_face = face;
        }
    }

    client->setCoordinates(biggest_face.x + biggest_face.width / 2,
        biggest_face.y + biggest_face.height/3, biggest_face.width,
        biggest_face.height);

}
