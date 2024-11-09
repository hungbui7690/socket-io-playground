const socket = io()

const form = document.getElementById('form')
const input = document.getElementById('input')

// 1.
form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    // @ sender -> socket.emit() -> emit "chat message" event
    socket.emit('chat message', input.value)
    input.value = ''
  }
})
