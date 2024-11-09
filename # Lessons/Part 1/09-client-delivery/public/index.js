let counter = 0

// @ With the retries option, the order of the messages is guaranteed, as the messages are queued and sent one by one. This is not the case with the first option.
const socket = io({
  auth: {
    serverOffset: 0,
  },
  ackTimeout: 10000, // enable retries
  retries: 3,
})

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    // @ compute a unique offset
    const clientOffset = `${socket.id}-${counter++}`
    socket.emit('chat message', input.value, clientOffset)

    // The socket.id attribute is a random 20-characters identifier which is assigned to each connection.
    // We could also have used getRandomValues() to generate a unique offset.

    input.value = ''
  }
})

socket.on('chat message', (msg, serverOffset) => {
  const item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
  socket.auth.serverOffset = serverOffset
})
