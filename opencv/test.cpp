#include "opencv2/objdetect.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc.hpp"

#include <iostream>

using namespace std;
using namespace cv;

static int setup_cascade (CascadeClassifier& face_cascad);
static int setup_capture (VideoCapture& capture);
static void detectFrame (Mat frame, CascadeClassifier& face_cascade);

String face_cascade_file    = "haarcascade_frontalface_alt.xml";
String window_name          = "Face Detection!";

int main (int argc, char** argv)
{
    CascadeClassifier face_cascade;

    if (!setup_cascade (face_cascade)) {
        return 1;
    }

    VideoCapture capture;
    if (!setup_capture (capture)) {
        return 1;
    }

    Mat frame;
    while (capture.read (frame)) {
        if (frame.empty ()) {
            cout << "No image captured." << endl;
            break;
        }

        detectFrame (frame, face_cascade);

        if (waitKey (10) == 27) {
            // escape key - exit
            break;
        }
    }
    return 0;
}

static int setup_cascade (CascadeClassifier& face_cascade)
{
    if (!face_cascade.load (face_cascade_file)) {
        cout << "Could not load face cascade." << endl;
        return 0;
    }

    return 1;
}

static int setup_capture (VideoCapture& capture)
{
    capture.open (-1);
    if (!capture.isOpened ()) {
        cout << "Error opening video capture." << endl;
        return 0;
    }

    return 1;
}

static void detectFrame (Mat frame, CascadeClassifier& face_cascade)
{
    vector<Rect> faces;
    Mat frame_gray;

    cvtColor (frame, frame_gray, COLOR_BGR2GRAY);
    equalizeHist (frame_gray, frame_gray);

    // detect face
    face_cascade.detectMultiScale (frame_gray, faces, 1.1, 2,
            CASCADE_SCALE_IMAGE, Size(30, 30));
    
    //checks for no faces
    if (faces.size() == 0) {
        imshow (window_name, frame);
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

    Point center (biggest_face.x + biggest_face.width / 2, biggest_face.y
            + biggest_face.height/3);
    circle (frame, center, 10, Scalar (255, 0, 0), 4, 8, 0);

    // show
    imshow (window_name, frame);
}


