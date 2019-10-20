var webpack = require("webpack");
var path = require("path");

module.exports = {
  // devtool: 'eval',
  devtool: "cheal-module-eval-source-map",
  entry: [
    // 'webpack-hot-middleware/client',
    "./src/run"
  ],

  output: {
    path: path.join(__dirname, "static"),
    filename: "build.js",
    publicPath: "/static/"
  },

  plugins: [
    new webpack.DefinePlugin({
      'window.__WEB__': true,
    })
  ],

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: "json-loader",
        include: path.join(__dirname, "cached")
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.join(__dirname, "src")
      }
    ]
  }
};
