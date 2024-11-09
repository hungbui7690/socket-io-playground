/*
  Intro 
  - Socket.io is a JavaScript library that allows two-way communication between your Node.js server and your web client
  - This is possible using sockets, which is a connection between 2 computers over the network. 
  
    # Server will emit an event.
    # Client will react on an event.


\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  Setup 
  - https://socket.io/docs/v4/tutorial/introduction
  - npm i socket.io


\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  Create Server with Express
  - https://socket.io/docs/v4/tutorial/step-1


------------------------

  ⛳ As far as I know, the Express app object does not know the server object. The way things work in Express, the app object is given to the server object, not the other way around. In fact a single app object can even be used with more than one server (sometimes done for an http and https server).
    -> You can get access to the server object from within a request handler with <req.connection.server>, but that comes from the server as part of the context with a request, that's not something the app object itself knows.
    -> So, if you want access to the server object for use with socket.io at initialization time, you will have to capture the server object into a variable where it is created.



*/

const express = require('express')
const { createServer } = require('http')

const app = express()
const server = createServer(app)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

server.listen(80, () => {
  console.log('server running at http://localhost:3000')
})
