#!/usr/bin/env node
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const mid = require('webpack-dev-middleware');
const hot = require('webpack-hot-middleware');
const fs = require('fs');

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
