/*
  With a Promise
  - The emitWithAck() method provides the same functionality, but returns a Promise which will resolve once the other side acknowledges the event:



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

// @ room management
io.on('connection', (socket) => {
  socket.join('abc') // join the room named 'abc'

  io.to('abc').emit('hello', 'world') // broadcast to all connected clients in the room

  io.except('abc').emit('hello', 'world') // broadcast to all connected clients except those in the room

  socket.leave('abc') // leave the room
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
