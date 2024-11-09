/*
  Handling disconnections
  - Now, let's highlight two really important properties of Socket.IO:
    # a Socket.IO client is not always connected
    # a Socket.IO server does not store any event


  🧵 Even over a stable network, it is not possible to maintain a connection alive forever.
    -> Which means that your application needs to be able to synchronize the local state of the client with the global state on the server after a temporary disconnection.


  🥌 The Socket.IO client will automatically try to reconnect after a small delay. However, any missed event during the disconnection period will effectively be lost for this client.


------------------------

  - But this is an awesome feature, why isn't this enabled by default?
  - There are several reasons for this:
    # it doesn't always work, for example if the server abruptly crashes or gets restarted, then the client state might not be saved
    # it is not always possible to enable this feature when scaling up



\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  Connection state recovery
  - First, let's handle disconnections by pretending that there was no disconnection: this feature is called "Connection state recovery".
  - This feature will temporarily store all the events that are sent by the server and will try to restore the state of a client when it reconnects:
    # restore its rooms
    # send any missed events



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)

// @ connection state recovery -> must enable on the server side
const io = new Server(server, {
  connectionStateRecovery: {},
})

app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

// @
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
