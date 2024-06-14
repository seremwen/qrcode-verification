// webpack.extra.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      path: false // Disables polyfill for path
    }
  },
  module: {
    rules: [
      {
        test: /\.bin$/,
        use: 'file-loader'
      }
    ]
  }
};
