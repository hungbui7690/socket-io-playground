/*
  Emitting Events 
  - The main idea behind Socket.IO is that you can send and receive any events you want, with any data you want. Any objects that can be encoded as JSON will do, and binary data is supported too.



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

// 2. when the user types in a message, the server gets it as a chat message event
io.on('connection', (socket) => {
  // @ receiver -> .on() -> listen to "chat message" event
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg) // we print out the chat message event
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
