import cv2
import argparse

parser = argparse.ArgumentParser(description='code for extracting frames from video')

parser.add_argument('--image_path', type=str, help='Video path to save result. See default for an e.g.', 
                                default="E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/inputs/downloaded_image.png")

parser.add_argument('--duration', type=str, help='duration of the resultant video', 
                                default=5)


parser.add_argument('--output_path', type=str, help='output path', 
                                default='E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/input_videos/input_video.mp4')

args = parser.parse_args()

# Path to your single frame image
print("here")
frame_path = args.image_path
video_duration = int(args.duration)+1
output_path = args.output_path

# Duration of the video in seconds

# Read the single frame image using OpenCV
frame = cv2.imread(frame_path)

# Get frame dimensions
height, width, _ = frame.shape

# Create a VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
# output_path = f'{frame_path}_output.mp4'
video_writer = cv2.VideoWriter(output_path, fourcc, 24.0, (width, height))

# Write the same frame repeatedly to create the video
for _ in range(int(24 * video_duration)):
    video_writer.write(frame)

# Release the VideoWriter
video_writer.release()
