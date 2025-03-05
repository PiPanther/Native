const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Modify the asset resolver to exclude fonts if they're causing issues
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'ttf' && ext !== 'otf');

// Add this to resolve the vector icons fonts
config.resolver.assetExts.push('ttf');

module.exports = config; 