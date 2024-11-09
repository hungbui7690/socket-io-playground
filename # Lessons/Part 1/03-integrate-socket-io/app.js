/*
  Integrating Socket.IO
  - <script src="https://cdn.socket.io/4.8.0/socket.io.min.js"></script>
    -> If you would like to use the local version of the client-side JS file, you can find it at node_modules/socket.io/client-dist/socket.io.js.

  ⛳ .on() -> register an event -> listen to an event
  ⛳ .emit() -> emit an event -> broadcast an event


------------------------

  Sender
  - socket.<emit>("hello", "world", (response) => {
      console.log(response); // "got it"
    });

  Receiver
  - socket.<on>("hello", (arg, callback) => {
      console.log(arg); // "world"
      callback("got it");
    });



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io') // 1.

const app = express()
const server = createServer(app)
const io = new Server(server) // 2. init a new instance of socket.io by passing the server (the HTTP server) object

app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

// 3. receiver -> consume the data -> test by enter a message in browser
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
