const https = require('https');
const fs = require('fs');

const assets = [
  {
    url: 'https://github.com/expo/expo/raw/master/templates/expo-template-blank/assets/icon.png',
    path: './assets/icon.png'
  },
  {
    url: 'https://github.com/expo/expo/raw/master/templates/expo-template-blank/assets/splash.png',
    path: './assets/splash.png'
  },
  {
    url: 'https://github.com/expo/expo/raw/master/templates/expo-template-blank/assets/adaptive-icon.png',
    path: './assets/adaptive-icon.png'
  }
];

assets.forEach(asset => {
  const file = fs.createWriteStream(asset.path);
  https.get(asset.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${asset.path}`);
    });
  }).on('error', err => {
    fs.unlink(asset.path);
    console.error(`Error downloading ${asset.url}: ${err.message}`);
  });
});
