const path = require('path');

const alias = require('./alias');

module.exports = [
  {
    test: /\.scss$/,
    exclude: [/[/\\]components[/\\]/, /[/\\](node_modules)[/\\]/],
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  },

  {
    test: /\.scss$/,
    include: /[/\\](components)[/\\]/,
    exclude: /[/\\](node_modules)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader'
    ]
  },
  {
    // global css
    test: /\.css$/,
    // include: /[/\\]node_modules[/\\]/,
    // include: /[\/\\](globalStyles)[\/\\]/,
    exclude: /[/\\](node_modules)[/\\]/,
    loaders: ['style-loader?sourceMap', 'css-loader', 'postcss-loader'],
  },
  // local css modules

  // // // global scss
  // // {
  // //   test: /\variables.scss$/,
  // //   exclude: /[/\\]components[/\\]/,
  // //   // include: /[/\\](styles/variables.scss)[/\\]/,
  // //   loaders: ['sass-variable-loader']
  // // },
  // // global scss
  // {
  //   test: /\.scss$/,
  //   exclude: /[/\\]components[/\\]/,
  //   use: [
  //     {
  //       loader: 'style-loader',
  //     },
  //     {
  //       loader: 'css-loader',
  //     },
  //     {
  //       loader: 'sass-loader',
  //       options: {
  //         includePaths: [path.resolve(__dirname, 'node_modules/bootstrap')],
  //       },
  //     },
  //   ],
  // },
  // // local scss modules
  // {
  //   test: /\.scss$/,
  //   include: /[/\\](components)[/\\]/,
  //   exclude: /[/\\](node_modules)[/\\]/,
  //   loaders: [
  //     'style-loader?sourceMap',
  //     'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
  //     'postcss-loader',
  //     'sass-loader',
  //   ],
  // },
  // {
  //   test: /\.less/,
  //   // exclude: /[\/\\]src[\/\\]/,
  //   include: /[/\\](node_modules)[/\\]/,
  //   loaders: ['style-loader?sourceMap', 'css-loader', 'less-loader'],
  // },
  {
    enforce: 'pre',
    test: /\.js$/,
    loader: 'babel-loader?cacheDirectory=true',
    exclude: /(node_modules|bower_components|public)/,
  },
  {
    enforce: 'pre',
    test: /\.jsx$/,
    use: ['babel-loader?cacheDirectory=true'],
    exclude: /(node_modules|bower_components|public)/,
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    // exclude: /(node_modules|bower_components)/,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'file-loader',
  },
  {
    test: /\.(woff|woff2)$/,
    // exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'url-loader?prefix=font/&limit=5000',
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    // exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    // include: path.join(__dirname, 'src'),
    loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /(node_modules|bower_components)/,
    // include: re,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /\.gif/,
    exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'url-loader?limit=10000&mimetype=image/gif',
  },
  {
    test: /\.jpg/,
    exclude: /(node_modules|bower_components)/,
    loader: 'url-loader?limit=10000&mimetype=image/jpg',
  },
  {
    test: /\.png/,
    exclude: /(node_modules|bower_components)/,
    loader: 'url-loader?limit=10000&mimetype=image/png',
  },
  {
    test: /\.csv/,
    exclude: /(node_modules|bower_components)/,
    loader: 'dsv-loader',
  },
];
