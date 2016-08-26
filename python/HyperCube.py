import cv2
import sys

cascade_path = sys.argv[1]
classifier = cv2.CascadeClassifier(cascade_path)

# https://realpython.com/blog/python/face-detection-in-python-using-a-webcam/
video_capture = cv2.VideoCapture(0)

# Scale the video down to size so as not to break performance
video_capture.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH, 640)
video_capture.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, 360)

while True:
    # Capture frame-by-frame
    ret, frame = video_capture.read()

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = classifier.detectMultiScale(
        gray_frame,
        scaleFactor=1.1,
        minNeighbors=2,
        minSize=(30, 30),
        flags=cv2.cv.CV_HAAR_SCALE_IMAGE
    )

    # Draw a rectangle around the faces
    for (x, y, w, h) in faces:
        print x, y, w, h
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture
video_capture.release()
cv2.destroyAllWindows()
