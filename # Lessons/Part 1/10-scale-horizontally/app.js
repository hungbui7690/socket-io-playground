/*
  Scaling horizontally
  - Now that our application is resilient to temporary network interruptions, let's see how we can horizontally scale it in order to be able to support thousands of concurrent clients.

    🎲 Horizontal scaling (also known as "scaling out") means adding new servers to your infrastructure to cope with new demands
    🎲 Vertical scaling (also known as "scaling up") means adding more resources (processing power, memory, storage, ...) to your existing infrastructure


---------------------------

  - First step: let's use all the available cores of the host. By default, Node.js runs your Javascript code in a single thread, which means that even with a 32-core CPU, only one core will be used. Fortunately, the Node.js cluster module provides a convenient way to create one worker thread per core.
  - We will also need a way to forward events between the Socket.IO servers. We call this component an "Adapter".

    ~~ npm install @socket.io/cluster-adapter



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// @
const { availableParallelism } = require('node:os')
const cluster = require('cluster')
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter')

// @ generate a cluster based on the number of available cores
if (cluster.isPrimary) {
  const numCPUs = availableParallelism()
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i,
    })
  }

  // set up the adapter on the primary thread
  return setupPrimary()
}

const app = express()
const server = createServer(app)

const io = new Server(server, {
  connectionStateRecovery: {},
})

app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

async function main() {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `)

  const app = express()
  const server = createServer(app)

  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
  })

  app.use(express.static(join(__dirname, 'public')))

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
  })

  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result
      try {
        result = await db.run(
          'INSERT INTO messages (content, client_offset) VALUES (?, ?)',
          msg,
          clientOffset
        )
      } catch (e) {
        if (e.errno === 19) {
          callback()
        } else {
        }
        return
      }
      io.emit('chat message', msg, result.lastID)
      callback()
    })

    if (!socket.recovered) {
      try {
        await db.each(
          'SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id)
          }
        )
      } catch (e) {}
    }
  })

  // @ each worker will listen on a distinct port
  const port = process.env.PORT

  // @
  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}

main()
