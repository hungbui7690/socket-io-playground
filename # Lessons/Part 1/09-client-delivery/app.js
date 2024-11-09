/*
  Client delivery
  - Let's see how we can make sure that the server always receives the messages sent by the clients.

    🥌 By default, Socket.IO provides an "at most once" guarantee of delivery (also known as "fire and forget"), which means that there will be no retry in case the message does not reach the server.


------------------------

  # Exactly once​
  - The problem with retries is that the server might now receive the same message multiple times, so it needs a way to uniquely identify each message, and only store it once in the database.
  - Let's see how we can implement an "exactly once" guarantee in our chat application.
  - We will start by assigning a unique identifier to each message on the client side


*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io')
const sqlite3 = require('sqlite3') // @
const { open } = require('sqlite')

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
        if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
          // @ the message was already inserted, so we notify the client
          callback() // This way, the UNIQUE constraint on the client_offset column prevents the duplication of the message.
        } else {
          // @ nothing to do, just let the client retry
        }
        return
      }
      io.emit('chat message', msg, result.lastID)
      // @ acknowledge the event
      callback() // @
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
      } catch (e) {
        // something went wrong
      }
    }
  })

  server.listen(80, () => {
    console.log('server running at http://localhost')
  })
}

main()
