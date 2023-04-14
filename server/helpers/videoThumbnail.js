const { spawn } = require('child_process');
const { createWriteStream } = require('fs');

const ffmpeg = require("fluent-ffmpeg");

const VideoDetails = require('../models/VideoDetailsSchema');
const port = require('../config/default').port;

// const ffmpegPath = '/usr/bin/ffmpeg';
// const ffmpegPath = 'C:/Users/LENOVO/Downloads/ffmpeg-6.0-essentials_build/bin';

const width = 256;
const height = 144;

const generateThumbnail = (target, title, username) => {
  title = title.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, '');
  let tmpFile = createWriteStream('media/uploads/video_thumbnails/' + title + '.jpg');
  // const ffmpeg = spawn(ffmpegPath, [
  //   '-ss',
  //   0,
  //   '-i',
  //   target,
  //   '-vf',
  //   `thumbnail,scale=${width}:${height}`,
  //   '-qscale:v',
  //   '2',
  //   '-frames:v',
  //   '1',
  //   '-f',
  //   'image2',
  //   '-c:v',
  //   'mjpeg',
  //   'pipe:1'
  // ]);
  // ffmpeg.stdout.pipe(tmpFile);
  console.log(target);
  ffmpeg(target)
  .seekInput(1.0)
  .frames(1)
  .size(width+"x"+height)
  .output(tmpFile)
  .on('end', () => {
    const videoDetails = new VideoDetails({
      uploader_name: username,
      upload_title: title,
      video_path: target,
      thumbnail_path: 'http://127.0.0.1:' + port + '/api/videos/video_thumbnails/' + encodeURIComponent(title + '.jpg')
    });
    videoDetails
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  );
}

module.exports = {
  generateThumbnail: generateThumbnail
}
