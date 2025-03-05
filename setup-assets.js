const fs = require('fs');
const path = require('path');

// Ensure directories exist
const fontDir = path.join(__dirname, 'assets', 'fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('Created fonts directory');
}

// Create placeholder files if they don't exist
const assetFiles = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png'
];

assetFiles.forEach(file => {
  const filePath = path.join(__dirname, 'assets', file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`Created placeholder for ${file}`);
  }
});

console.log('Asset setup complete!'); 