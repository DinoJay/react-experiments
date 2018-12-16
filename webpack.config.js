const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const tailwindcss = require('tailwindcss');

const apiTokens = require('./api-keys.json');

const loaders = require('./webpack.loaders');

const alias = require('./alias');

// const apiTokens = require('./api_keys.json');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000';

module.exports = {
  entry: [
    './src/index.jsx', // your app's entry point
  ],
  // TODO: change for production
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias
  },
  module: {
    rules: loaders,
  },
  devServer: {
    contentBase: './public',
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    disableHostCheck: true,
    // TODO: change back later
    https: false,
    progress: true,

    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers':
    //     'X-Requested-With, content-type, Authorization'
    // }
    // proxy: {
    //   '**': {
    //     target: 'http://localhost:8000/',
    //     secure: false
    //   }
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ErrorOverlayPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      title: 'my react experiments',
    }),
    new webpack.EnvironmentPlugin(apiTokens),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    require('autoprefixer'),
  ],
};
