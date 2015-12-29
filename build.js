
var webpack = require('webpack')
var config = require('./webpack.config.js')
var fs = require('fs')

config.output.filename = 'build-[hash].js'
config.devtool = 'source-map'
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin()
)

webpack(config, function(err, stats) {
  if (err) {
    return console.error(err)
  }
  var data = stats.toJson({
    hash: true,
  })
  var html = fs.readFileSync('./index.dev.html').toString('utf8').replace('"/static/build.js"', '"/static/build-' + data.hash + '.js"')
  fs.writeFileSync('./index.html', html, 'utf8')
  fs.writeFileSync('./200.html', html, 'utf8')
})


