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

// 2.
io.on('connection', (socket) => {
  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1) // { foo: 'bar' }
    console.log(arg2) // 'baz'
    callback({
      status: 'ok',
    })
  })
})

server.listen(80, () => {
  console.log('server running at http://localhost')
})
