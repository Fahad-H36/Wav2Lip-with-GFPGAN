@echo off

:: Capture the start time
for /f "delims=" %%a in ('powershell Get-Date -UFormat %%s') do set "start_time=%%a"

:: Set variables
set "root=E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip"
set "filename=input_video"
set "image_path=E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/inputs/downloaded_image.png"
set "input_video=input_videos"
set "input_audio=E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/inputs/downloaded_audio.wav"
set "frames_wav2lip=frames_wav2lip"
set "frames_hd=frames_hd"
set "output_videos_wav2lip=output_videos_wav2lip"
set "output_videos_hd=output_videos_hd"
set "back_dir=.."
set "duration=4"

:: Run Python commands
@REM python image2video.py --image_path %image_path% --duration %duration% 
@REM python inference.py --checkpoint_path  %root%\checkpoints\wav2lip.pth --face  %root%\%input_video%\%filename%.mp4 --audio %input_audio%
@REM python video2frames.py --input_video  %root%/results/result_voice.mp4 --frames_path  %root%/%frames_wav2lip%/%filename%
@REM python GFPGAN\inference_gfpgan.py -i %frames_wav2lip%\%filename% -o  %root%/GFPGAN\results -v 1.3 -s 2
@REM ffmpeg -framerate 24 -i  %root%/GFPGAN\results\restored_imgs\frame_%%05d.jpg -i  %input_audio% -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest results\%filename%_final_result.mp4
@REM rmdir /s /q  %root%/%frames_wav2lip%\%filename%
@REM rmdir /s /q  %root%/GFPGAN\results\*

:: Run Python commands
python image2video.py --image_path %image_path% --duration %duration% 
python inference.py --checkpoint_path  %root%\checkpoints\wav2lip.pth --face  %root%\%input_video%\%filename%.mp4 --audio %input_audio%
@REM python video2frames.py --input_video  %root%/results/result_voice.mp4 --frames_path  %root%/%frames_wav2lip%/%filename%
@REM python GFPGAN\inference_gfpgan.py -i %frames_wav2lip%\%filename% -o  %root%/GFPGAN\results -v 1.3 -s 2
@REM ffmpeg -framerate 24 -i  %root%/GFPGAN\results\restored_imgs\frame_%%05d.jpg -i  %input_audio% -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest results\%filename%_final_result.mp4
@REM ffmpeg -framerate 24 -i  %frames_wav2lip%\%filename%\frame_%%05d.jpg -i  %input_audio% -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest results\%filename%_final_result.mp4
rmdir /s /q  %root%/%frames_wav2lip%\%filename%
@REM rmdir /s /q  %root%/GFPGAN\results\*


python test.py

:: Capture the end time
for /f "delims=" %%a in ('powershell Get-Date -UFormat %%s') do set "end_time=%%a"

:: Calculate the time difference
set /a "time_difference=end_time - start_time"

:: Format the time difference
powershell -command "[TimeSpan]::FromSeconds(%time_difference%).ToString('hh\:mm\:ss')"
