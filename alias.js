const path = require('path');

module.exports = {
  // 'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
  Src: path.resolve(__dirname, './src'),
  Styles: path.resolve(__dirname, './src/styles'),
  Components: path.resolve(__dirname, 'src/components'),
  Constants: path.resolve(__dirname, 'src/constants')
};
