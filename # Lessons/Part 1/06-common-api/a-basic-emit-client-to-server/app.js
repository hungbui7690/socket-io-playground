/*
  Basic Emit
  - we can send any data to the other side with socket.emit()



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
  // 2.
  socket.on('hello', (arg) => {
    console.log(arg) // 'world'
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
