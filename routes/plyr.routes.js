const express = require('express');
const router = express.Router();

router.post('/iframe', (req, res) => {
  try {
    const requestJSON = req.body;

    if (!requestJSON || !requestJSON.video || !requestJSON.video.sources) {
      return res.status(400).send({
        message: 'JSON Configuration is required.',
        requestJSON,
      });
    }

    const plyrConfig = requestJSON;

    const sourcesHTML = plyrConfig.video.sources
      .map(
        (source) => `
          <source data-quality="${source.size}" src="${source.src}" type="${source.type}" size="${source.size}" />
        `
      )
      .join('');

    const tracksHTML = plyrConfig.video.tracks
      .map(
        (track) => `
          <track kind="${track.kind}" label="${track.label}" srclang="${
          track.srclang
        }" src="${track.src}"${track.default ? ' default' : ''} />
        `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Childe Anime Player</title>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          :root {
              --plyr-color-main: rgb(0, 112, 112);
          }

          body {
              font-family: 'Inter', sans-serif;
          }
          
          video {
              max-width: 100%;
              height: auto;
          }
        </style>
      </head>
      <body>
        <video controls crossorigin playsinline id="player" style="max-width:100%; height:auto;">
          ${tracksHTML}
        </video>
        <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            var video = document.getElementById('player');
            var source = '${plyrConfig.video.sources[0].src}';
            const defaultOptions = {};

            if(Hls.isSupported()) {
              const hls = new Hls();
              hls.loadSource(source);

              hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const availableQualities = hls.levels.map((l) => l.height);
                defaultOptions.controls = [
                  'restart',
                  'rewind', 
                  'play',
                  'fast-forward', 
                  'progress',
                  'current-time',
                  'duration', 
                  'mute',
                  'volume',
                  'captions',
                  'settings',
                  'pip',
                  'airplay',
                  'fullscreen',          
                ];

                const savedProgress = JSON.parse(localStorage.getItem('videoProgress')) || {};
                const savedQuality = savedProgress.quality || availableQualities[0];
                const savedTime = savedProgress.time || 0;        

                defaultOptions.quality = {
                  default: savedQuality,
                  options: availableQualities,
                  forced: true,
                  onChange: (e) => updateQuality(e)
                }
                video.currentTime = savedTime;
                updateQuality(savedQuality);
                new Plyr(video, defaultOptions)
              })
              hls.attachMedia(video);
              window.hls = hls;
            }
            function updateQuality(newQuality) {
              window.hls.levels.forEach((level, levelIndex) => {
                if(level.height === newQuality) {
                  window.hls.currentLevel = levelIndex
                }
              })
            }
            video.addEventListener('timeupdate', () => {
              const videoProgress = {
                time: video.currentTime,
                quality: window.hls.levels[window.hls.currentLevel].height,
              };
              localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
            });
        
            video.addEventListener('qualitychange', () => {
              const videoProgress = {
                time: video.currentTime,
                quality: window.hls.levels[window.hls.currentLevel].height,
              };
              localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
            });
          });        
          });
        </script>
      </body>
      </html>
    `;

    res.status(200).send(htmlContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
