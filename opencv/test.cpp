#include <opencv2/objdetect/objdetect.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <iostream>

using namespace cv;
using namespace std;

int main (int argc, char** argv)
{
    int c;
    IplImage* color_img;
    CvCapture* cv_cap = cvCaptureFromCAM (-1);
    cvNamedWindow ("Video", 1);
    for (;;) {
        color_img = cvQueryFrame (cv_cap);
        if (color_img != 0) {
            cvShowImage ("Video", color_img);
        }
        c = cvWaitKey (10);
        if (c == 27) {
            break;
        }
    }
    cvReleaseCapture (&cv_cap);
    cvDestroyWindow ("Video");
}
