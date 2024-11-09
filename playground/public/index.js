let counter = 0

const socket = io({
  ackTimeout: 10000,
  retries: 3,
  auth: {
    serverOffset: 0,
  },
})

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    const clientOffset = `${socket.id}-${counter++}`
    socket.emit('chat message', input.value, clientOffset)
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
