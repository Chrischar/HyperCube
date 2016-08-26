import cv2
import sys
import pyglet

cascade_path = sys.argv[1]
classifier = cv2.CascadeClassifier(cascade_path)

# https://realpython.com/blog/python/face-detection-in-python-using-a-webcam/
video_capture = cv2.VideoCapture(0)

# Scale the video down to size so as not to break performance
video_capture.set(cv2.cv.CV_CAP_PROP_FRAME_WIDTH, 480)
video_capture.set(cv2.cv.CV_CAP_PROP_FRAME_HEIGHT, 360)

window = pyglet.window.Window(width=480, height=360)

image = pyglet.resource.image('player.png')

@window.event
def on_draw():
    window.clear()
    ret, frame = video_capture.read()
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = classifier.detectMultiScale(
        gray_frame,
        scaleFactor=1.1,
        minNeighbors=2,
        minSize=(30, 30),
        flags=cv2.cv.CV_HAAR_SCALE_IMAGE
    )

    for (x, y, w, h) in faces:
        print x, y, w, h
        image.blit(480 - x, 360 - y)
        image.blit(480 - x - w , 360 - y)
        image.blit(480 - x - w, 360 - y - h)
        image.blit(480 - x, 360 - y - h)

def update(dt):
    on_draw()
    
if __name__ == "__main__":
    pyglet.clock.schedule_interval(update, 1/30)
    pyglet.app.run()


