var webpack = require('webpack');
var path = require('path');

module.exports = {
  // devtool: 'eval',
  devtool: 'cheal-module-eval-source-map',
  entry: [
    // 'webpack-hot-middleware/client',
    './src/run',
  ],

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'build.js',
    publicPath: '/static/',
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [{
      text: /\.json$/,
      loader: 'json',
      include: path.join(__dirname, 'cached'),
    }, {
      text: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      query: {
        env: {
          development: {
            plugins: [
              'transform-runtime',
              /*
              ['react-transform', {
                transforms: [{
                  transform: "react-transform-hmr",
                  imports: ["react"],
                  locals: ["module"]
                }, {
                  transform: "react-transform-catch-errors",
                  imports: ["react", "redbox-react"]
                }]
              }]
              */
            ]
          }
        }
      }
    }],
  },
}

