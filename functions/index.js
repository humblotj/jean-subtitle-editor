/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

const cors = require('cors')({ origin: true });

const fs = require('fs');
const ytdl = require('ytdl-core');
const os = require('os');
const path = require('path');
const UUID = require("uuid-v4");

const FFmpeg = require('fluent-ffmpeg');
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
FFmpeg.setFfmpegPath(ffmpegPath);

const bucketName = 'gs://jean-subtitle-editor.appspot.com';

exports.youtubedl = functions.https.onRequest(async (req, res) => {
  const bucket = admin.storage().bucket(bucketName);
  const tempFilePath = path.join(os.tmpdir(), req.name + '.mp4');
  try {
    const file = bucket.file('video/youtube/' + req.query.name + '.mp4')
    file.exists().then((data) => {
      return data[0];
    })
      .then(fileExists => {
        if (fileExists) {
          file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
          }).then(signedUrls => {
            cors(req, res, () => {
              res.status(200).send(JSON.stringify(signedUrls[0]));
            })
            return;
          });
        } else {
          const uuid = UUID();
          ytdl('https://www.youtube.com/watch?v=' + req.query.id, {
            filter: (format) => format.container === 'mp4'
          })
            .on('finish', async () => {
              await bucket.upload(tempFilePath, {
                destination: 'video/youtube/' + req.query.name + '.mp4',
                resumable: false,
                metadata: {
                  metadata: {
                    firebaseStorageDownloadTokens: uuid
                  }
                }
              }).then((data) => {
                let file = data[0];
                return Promise.resolve(
                  "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" +
                  encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
              }).then(downloadURL => {
                cors(req, res, () => {
                  res.status(200).send(JSON.stringify(downloadURL));
                })
                return;
              });
            })
            .pipe(fs.createWriteStream(tempFilePath));
        }
        return;
      })
  }
  catch (error) {
    cors(req, res, () => {
      res.status(500).send(error);
    })
  }
});

exports.convertAudio = functions.https.onRequest(async (req, res) => {
  const filePath = 'video/' + req.query.id + '/' + req.query.name + req.query.extension; // File path in the bucket.
  console.log(filePath);

  const fileName = req.query.name;
  const bucket = admin.storage().bucket(bucketName);
  const tempFilePath = path.join(os.tmpdir(), fileName);


  await bucket.file(filePath).download({
    destination: tempFilePath
  }).then(
    () => {
      console.log('Audio downloaded locally to', tempFilePath);
      const audioConvertedName = `${req.query.name}_converted`;
      const tempConvertedPath = path.join(os.tmpdir(), audioConvertedName);

      const command = FFmpeg(tempFilePath)
        .noVideo()
        .withAudioChannels(1)
        .withAudioFrequency(16000)
        .withAudioQuality(5)
        .withOutputFormat("wav")
        .on("start", (commandLine) => {
          console.log("ffmpeg conversion start: ", commandLine);
        })
        .on("progress", progress => {
          // console.log("Processing: " + progress.percent + "% done");
        })
        .on("stderr", stderrLine => {
          //console.log("Stderr output: " + stderrLine);
        })
        .on("codecData", data => {
          console.log("Input is " + data.audio + " audio " + "with " + data.video + " video");
        })
        .on("end", () => {
          console.log("ffmpeg file has been locally converted successfully!...");
          const uuid = UUID();
          bucket.upload(tempConvertedPath, {
            destination: 'audio/' + req.query.name + '.wav',
            resumable: false,
            metadata: {
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          }).then((data) => {
            let file = data[0];
            return Promise.resolve(
              "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" +
              encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
          }).then(downloadURL => {
            cors(req, res, () => {
              res.status(200).send(JSON.stringify(downloadURL));
            })
            return;
          });
        })
        .on("error", (error) => {
          console.log("ffmpeg Error: ", error);
          // send back the reponse
          cors(req, res, () => {
            res.status(417).send(`{"ffmpeg Error": "${error}"}`);
          })
        })
        .pipe(fs.createWriteStream(tempConvertedPath));
      return;
    }
  );
});

exports.cutAndAddSubtitle = functions.https.onRequest(async (req, res) => {
  if (req.query.duration / 60 > 3) {
    cors(req, res, () => {
      res.status(500).send('Duration too long');
    })
  } else {
    const filePath = 'video/' + req.query.id + '/' + req.query.name + '.' + req.query.extension; // File path in the bucket.
    console.log(filePath);
    const subtitlePath = 'subtitle/' + req.query.id + '/' + req.query.name + '.ass'; // File path in the bucket.

    const fileName = req.query.name;
    const bucket = admin.storage().bucket(bucketName);
    const tempFilePath = path.join(os.tmpdir(), fileName + '.' + req.query.extension);
    const tempSubtitlePath = path.join(os.tmpdir(), req.query.name + '.ass');

    await bucket.file(subtitlePath).download({
      destination: tempSubtitlePath
    }).then(async () =>
      await bucket.file(filePath).download({
        destination: tempFilePath
      })).then(
        () => {
          console.log('Video downloaded locally to', tempFilePath);
          const videoConvertedName = `${req.query.name}_converted`;
          const tempConvertedPath = path.join(os.tmpdir(), videoConvertedName + '.mp4');

          const command = FFmpeg(tempFilePath)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .outputOptions('-vf subtitles=' + tempSubtitlePath)
            .setStartTime(req.query.start)
            .setDuration(req.query.duration)
            .on("start", (commandLine) => {
              console.log("ffmpeg conversion start: ", commandLine);
            })
            .on("progress", progress => {
              // console.log("Processing: " + progress.percent + "% done");
            })
            .on("stderr", stderrLine => {
              //console.log("Stderr output: " + stderrLine);
            })
            .on("codecData", data => {
              console.log("Input is " + data.audio + " audio " + "with " + data.video + " video");
            })
            .on("end", () => {
              console.log("ffmpeg file has been locally converted successfully!...");
              const uuid = UUID();
              bucket.upload(tempConvertedPath, {
                destination: 'videoWithSubtitles/' + req.query.name + '.mp4',
                resumable: false,
                metadata: {
                  metadata: {
                    firebaseStorageDownloadTokens: uuid
                  }
                }
              }).then((data) => {
                let file = data[0];
                return Promise.resolve(
                  "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" +
                  encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
              }).then(downloadURL => {
                cors(req, res, () => {
                  res.status(200).send(JSON.stringify(downloadURL));
                })
                return;
              });
            })
            .on("error", (error) => {
              console.log("ffmpeg Error: ", error);
              // send back the reponse
              cors(req, res, () => {
                res.status(417).send(`{"ffmpeg Error": "${error}"}`);
              })
            })
            .save(tempConvertedPath);
          return;
        }
      );
  }
});
