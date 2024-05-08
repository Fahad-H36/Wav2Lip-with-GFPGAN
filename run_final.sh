# start_time=$(date +%s)


export filename=black_woman
export input_video=input_videos
export input_audio=I_have_a_dream.wav
export frames_wav2lip=frames_wav2lip
export frames_hd=frames_hd
export output_videos_wav2lip=output_videos_wav2lip
export output_videos_hd=output_videos_hd
export back_dir=..

python inference.py --checkpoint_path checkpoints/wav2lip.pth --face input_videos/${filename}.mp4 --audio input_audios/${input_audio} 
python video2frames.py --input_video results/result_voice.mp4 --frames_path ${frames_wav2lip}/${filename}
python GFPGAN/inference_gfpgan.py -i ${frames_wav2lip}/${filename} -o GFPGAN/results -v 1.3 -s 2
ffmpeg -framerate 26 -i GFPGAN/results/restored_imgs/frame_%05d.jpg -i input_audios/${input_audio} -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest results/${filename}_final_result.mp4
rm -r ${frames_wav2lip}/${filename}
rm -r GFPGAN/results/*




# # Capture the end time
# end_time=$(date +%s)

# # Calculate the time difference
# time_difference=$((end_time - start_time))

# # Format the time difference
# formatted_time_difference=$(date -u -d @"$time_difference" +'%H:%M:%S')
# echo "Time elapsed:      $formatted_time_difference"
