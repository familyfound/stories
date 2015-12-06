#!/usr/bin/env babel-node
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import config from './webpack.config'
import mid from 'webpack-dev-middleware'
import hot from 'webpack-hot-middleware'
import fs from 'fs'

const app = express()
const compiler = webpack(config)

app.use(mid(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}))
app.use(hot(compiler))

app.get('/static/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', req.params[0]))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.dev.html'))
})

const PORT = process.env.PORT || 7200

app.listen(PORT, 'localhost', err => {
  if (err) {
    console.error('Server Error', err, err.stack)
    return
  }

  console.log(`Listening at http://localhost:${PORT}`)
})
