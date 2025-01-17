// @
const socket = io({
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
    socket.emit('chat message', input.value)
    input.value = ''
  }
})

// @ new serverOffset param
socket.on('chat message', (msg, serverOffset) => {
  const item = document.createElement('li')
  item.textContent = msg
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
  socket.auth.serverOffset = serverOffset // @ update serverOffset
})
