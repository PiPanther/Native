const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Make sure assets directory exists
if (!fs.existsSync('./assets')) {
  fs.mkdirSync('./assets');
}

// Generate a simple colored square image
function generateImage(filename, size, color) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill with background color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  
  // Add some text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${size/10}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(filename, size/2, size/2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join('./assets', filename), buffer);
  console.log(`Generated ${filename}`);
}

// Generate the required assets
generateImage('icon.png', 1024, '#2196F3');
generateImage('adaptive-icon.png', 1024, '#4CAF50');
generateImage('splash.png', 2048, '#FF9800');
