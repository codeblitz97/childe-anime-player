const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');

let plyrConfig;

router.post('/iframe', (req, res) => {
  try {
    const requestJSON = req.body;

    if (!requestJSON || !requestJSON.video || !requestJSON.video.sources) {
      return res.status(400).send({
        message: 'JSON Configuration is required.',
        requestJSON,
      });
    }

    plyrConfig = requestJSON;

    const sourcesHTML = plyrConfig.video.sources
      .map(
        (source) => `
          <source src="${source.src}" type="${source.type}" size="${source.size}" />
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
              max-width: 1080px;
              height: 720px;
          }
        </style>
      </head>
      <body>
        <video controls crossorigin playsinline id="player" style="max-width:1080px; height:720px;">
          ${sourcesHTML}
          ${tracksHTML}
        </video>
        <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const selector = '#player';
            const player = new Plyr(selector, {
              controls: [
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'settings',
                'pip',
                'airplay',
                'fullscreen',
              ],
            });

            if (Hls.isSupported()) {
              const hls = new Hls();
              hls.loadSource('${plyrConfig.video.sources[0].src}');
              hls.attachMedia(player.media);
            }
    
            window.player = player;
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
