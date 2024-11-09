/*
  Serving HTML
  - create public/index.html



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')

const app = express()
const server = createServer(app)

// 1.
app.use(express.static(join(__dirname, 'public')))

// 2.
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
