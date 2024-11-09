/*
  With a callback function​
  - You can add a callback as the last argument of the emit(), and this callback will be called once the other side has acknowledged the event:



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
