const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: path.join(__dirname, 'src/index.js'),
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    alias: {
      'redux-app-state': path.join(__dirname, '../lib/main.js'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new DirectoryNamedWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, '../lib'),
      ],
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      use: [
        'style-loader', {
          loader: 'css-loader',
          query: {
            modules: true,
          },
        },
      ],
    }],
  },
};
