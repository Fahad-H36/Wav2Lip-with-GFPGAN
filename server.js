const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { default: axios } = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { execSync } = require('child_process');
const { supabase } = require('./supabase');
const timeout = require('connect-timeout')
const debug = require('debug')('http');

const app = express();
const port = 3000; // Set the desired port number


// app.use(timeout(10 * 60 * 1000))
app.use(express.json()); // Enable JSON parsing middleware


// app.use((req, res, next) => {
//   req.setTimeout(300000, () => { // Set timeout to 3 minutes (180 seconds)
//     debug('Request timeout');
//     res.status(504).end('Request timed out'); // Handle timeout gracefully
//     res.destroy(); // Destroy the request to prevent hanging connections
//   });
//   next();
// });
// console.log('hello there')

// const apiTimeout = 600000
// app.use((req, res, next) => {
//   // Set the timeout for all HTTP requests
//   req.setTimeout(apiTimeout, () => {
//       let err = new Error('Request Timeout');
//       err.status = 408;
//       next(err);
//   });
//   // Set the server response timeout for all HTTP requests
//   res.setTimeout(apiTimeout, () => {
//       let err = new Error('Service Unavailable');
//       err.status = 503;
//       next(err);
//   });
//   next();
// });


// Specify the path where you want to save the uploaded files
const image_download_path = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/inputs/downloaded_image.png';
const audio_download_path = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/inputs/downloaded_audio.wav';

const scriptPath = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/run_final.bat';
let modifiedScriptPath = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/final_execution.bat';

// Configure multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),

const root = "E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip"

app.post('/run-script', async (req, res) => {
  // const scriptPath = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/run_final.bat';
  // req.setTimeout(600000)
  // res.setTimeout(600000, function() {
  //   console.log('timeout set')
  // })

  // req.setTimeout(600000);
  // res.setTimeout(600000);


  const imageUrl = req.body['image'];
  const audioUrl = req.body['audio'];
  const projectId = req.body['projectId'];
  console.log(imageUrl)

  const downloadedImage = await axios.get(imageUrl, {
    responseType: 'arraybuffer' 
  })



  console.log(downloadedImage.data)
  const buffer = Buffer.from(downloadedImage.data);
  console.log(buffer)
  fs.writeFile(image_download_path, buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
    } else {
      console.log('File saved successfully.');
    }
  });


  const downloadedAudio = await axios.get(audioUrl, {
    responseType: 'arraybuffer' 
  })


  
  console.log(downloadedAudio.data)
  fs.writeFile(audio_download_path, downloadedAudio.data, (err) => {
    if (err) {
      console.error('Error saving file:', err);
    } else {
      console.log('File saved successfully.');
    }
  });


  getAudioDuration(audio_download_path, (durationInSeconds) => {
    console.log(`Audio duration: ${durationInSeconds} seconds`);


    modifyScript(image_download_path, audio_download_path, durationInSeconds);
  })
  

  console.log("Here it is", modifiedScriptPath)







  // const child = execSync(`cmd /c ${modifiedScriptPath}`);
  const child = spawn('cmd', ['/c', modifiedScriptPath]);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    
  });

  child.on('close', async (code) => {
    console.log(`child process exited with code ${code}`);
    // res.send(`Script execution completed with code ${code}`);
    const uploadedFile = await uploadFile();
    const url = uploadedFile.data.publicUrl
    const uploadedProject = await updateDatabase(projectId, url)
    res.json({data: uploadedProject})
  });

  
 

  // res.json({message:"success"})

});

app.get('/', (req, res) => {
  // console.log(req.setTimeout(30))
  res.json({message: 'success'})
})

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);                                  
});
server.setTimeout(0)
console.log(server.timeout)

// server.setTimeout(600000)
// console.log(server.timeout)
// server.timeout = 0
// console.log(server.timeout)
// server.headersTimeout = 600000;
// server.timeout = 600000
// server.keepAliveTimeout = 600000


const updateDatabase = async (projectId, videoUrl) => {
  console.log("Project Id", projectId)
  console.log("video url",videoUrl)
  // const updatedProject = await supabase.from('Project').upsert({id: projectId, videoUrl: videoUrl}).select();


  // if (error) console.log('Error updating database', error)
  // if (error) return error;
  
  // console.log(updatedProject);
  // return updatedProject.data;


  const {data, error} = await supabase
    .from('Project')
    .update({ videoUrl: videoUrl })
    .eq('id', projectId).select('videoUrl');

    if (error) {
      console.error('error updating videoUrl:', error);
      return error;
    } else {
      console.log('videoUrl updated successfully:', data);
      return data;
    }

}


const uploadFile = async () => {
  
  
  try {
    const fileData = fs.readFileSync(root + '/results/result_voice.mp4')

    const fileName = `public/${Date.now()}.mp4`

    const { data, error } = await supabase.storage
      .from('videos') // Specify the folder name where you want to store the file
      .upload(fileName, fileData, {
        cacheControl: '3600',
        contentType: 'video/mp4', // Adjust contentType according to your file type
      });

    if (error) {
      throw error;
    }



    console.log('File uploaded successfully:', data);
    const uploadedFile = await supabase
    .storage
    .from('videos')
    .getPublicUrl(fileName)

    deleteFile(root + '/inputs/downloaded_audio.wav')
    deleteFile(root + '/inputs/downloaded_image.png')
    deleteFile(root + '/input_videos/input_video.mp4')
    // deleteFile('/input_videos/input_video.mp4')
    return uploadedFile;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
}

function deleteFile(filePath) {
  // Check if the file exists before attempting to delete
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
          console.error('File does not exist');
          return;
      }

      // File exists, so delete it
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Error deleting file:', err);
              return;
          }
          console.log('File deleted successfully');
      });
  });
}


function modifyScript(imageFile, audioFile, audioDuration) {
  let scriptContent = fs.readFileSync(scriptPath, 'utf-8');
  modifiedScriptPath = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/final_execution.bat'

  // Modify the script content based on your requirements
  // Replace placeholders with actual file paths and audio duration in seconds (rounded up)
  scriptContent = scriptContent.replace('{{input_image_path}}', imageFile);
  scriptContent = scriptContent.replace('{{input_audio_path}}', audioFile);
  scriptContent = scriptContent.replace('{{expectedDuration}}', audioDuration);

  // Save the modified content back to the script
  fs.writeFileSync(modifiedScriptPath, scriptContent);
  console.log(`Modified script saved: ${modifiedScriptPath}`);
}

function getAudioDuration(audioFilePath, callback) {
  ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
    if (err) {
      console.error(`Error getting audio duration: ${err}`);
      callback(null);
    } else {
      const durationInSeconds = Math.ceil(metadata.format.duration);
      callback(durationInSeconds);
    }
  });
}































// const express = require('express');
// const { spawn } = require('child_process');

// const app = express();
// const port = 3000; // Set the desired port number

// app.post('/run-script', (req, res) => {
//   const scriptPath = 'E:/Fahads_FYP/SpeechClone/SpeechClone/Wav2Lip/Wav2Lip/run_final.bat';

//   const child = spawn('cmd', ['/c', scriptPath]);

//   child.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });

//   child.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   child.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//     res.send(`Script execution completed with code ${code}`);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
