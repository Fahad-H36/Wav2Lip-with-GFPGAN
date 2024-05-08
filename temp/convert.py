from moviepy.editor import VideoFileClip, AudioFileClip

# File paths
audio_path = "ai.wav"
video_path = 'result.mp4'
output_path = "with_audio.mp4"

# Load video and audio clips
video_clip = VideoFileClip(video_path)
audio_clip = AudioFileClip(audio_path)

# Set the audio of the video clip to the loaded audio clip
video_clip = video_clip.set_audio(audio_clip)

# Write the video with added audio to a new file
video_clip.write_videofile(output_path, codec='libx264', audio_codec='aac')
