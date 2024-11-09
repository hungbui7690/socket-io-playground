/*
  Server delivery
  - There are two common ways to synchronize the state of the client upon reconnection:
    # either the server sends the whole state
    # or the client keeps track of the last event it has processed and the server sends the missing pieces

  - Both are totally valid solutions and choosing one will depend on your use case. In this tutorial, we will go with the latter.


--------------------------

  - Server: Persist the messages of our chat application -> SQLite
    # io.emit('chat message', msg, result.lastID) -> assign the id to the message (offset)
  - Client: will then keep track of the offset


\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  ~~ npm install sqlite sqlite3


  🎲 The difference with the "Connection state recovery" feature is that a successful recovery might not need to hit your main database (it might fetch the messages from a Redis stream for example).



*/

const express = require('express')
const { createServer } = require('http')
const { join } = require('path')
const { Server } = require('socket.io')
const sqlite3 = require('sqlite3') // @
const { open } = require('sqlite')

// @
async function main() {
  // create db
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database,
  })

  // create table
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
    socket.on('chat message', async (msg) => {
      let result
      try {
        // store the message in the database
        result = await db.run('INSERT INTO messages (content) VALUES (?)', msg)
      } catch (e) {
        // TODO handle the failure
        return
      }
      // @ include the offset with the message
      io.emit('chat message', msg, result.lastID)
    })

    // @ And finally the server will send the missing messages upon (re)connection:
    if (!socket.recovered) {
      // if the connection state recovery was not successful
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

main() // @
