/*
  Broadcasting
  - The next goal is for us to emit the event from the server to the rest of the users.


------------------------

  - On the server-side, you can send an event to all connected clients or to a subset of clients:
    # to <all> connected clients
      -> io.emit("hello");

    # to <all> connected clients in the <news> room
      -> io.to("news").emit("hello");


  🎋 we will work on the client only 



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
  // @ Still need this
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
