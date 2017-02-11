const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: path.join(__dirname, 'src/index.js'),
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      'redux-app-state': path.join(__dirname, '../lib/main.js'),
    },
  },
  plugins: [new HtmlWebpackPlugin()],
  module: {
    loaders: [{
      test: /\.js/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, '../lib'),
      ],
      loader: 'babel-loader',
    }],
  },
};
