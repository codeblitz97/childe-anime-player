const express = require('express');
const router = express.Router();
let plyrConfig;
router.get('/iframe', (req, res) => {
  try {
    const requestJSON = req.body;
    if (!requestJSON || !requestJSON.video || !requestJSON.video.sources) {
      return res.status(400).send('Invalid Plyr configuration.');
    }
    plyrConfig = requestJSON;
    const sourcesHTML = plyrConfig.video.sources
      .map(
        (source) =>
          `<source src="${source.src}" type="${source.type}" size="${source.size}" />`
      )
      .join('');
    const tracksHTML = plyrConfig.video.tracks
      .map(
        (track) =>
          `<track kind="${track.kind}" label="${track.label}" srclang="${
            track.srclang
          }" src="${track.src}"${track.default ? ' default' : ''}/>`
      )
      .join('');
    const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Childe Anime Player</title><link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" /><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>:root {--plyr-color-main: rgb(0, 112, 112);} body {font-family: 'Inter', sans-serif;} button.plyr__control--overlaid {display:none; visibility: hidden;} </style></head><body><video controls crossorigin playsinline id="player">${sourcesHTML}${tracksHTML}</video><script src="https://cdn.plyr.io/3.7.8/plyr.js"></script><script>document.addEventListener('DOMContentLoaded', () => {const selector = '#player';const player = new Plyr(selector, { controls: ["play", "progress", "current-time", "duration", "mute", "volume", "settings", "pip", "airplay", "fullscreen"], i18n: { play: "Play (K)", pause: "Pause (K)", mute: "Mute (M)", unmute: "Unmute (M)", enterFullscreen: "Enter fullscreen (F)", exitFullscreen: "Exit fullscreen (F)", qualityLabel: { 0: "Auto" } }, seekTime: 5, keyboard: { focused: !0, global: !0 }, fullscreen: { iosNative: !0 } }); window.player = player; });</script></body></html>`;

    // Encode the HTML content
    const encodedHtmlContent = encodeURIComponent(htmlContent);

    // Set the encoded HTML content as the srcdoc attribute
    const iframeContent = `<iframe srcdoc="${encodedHtmlContent}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(iframeContent);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
