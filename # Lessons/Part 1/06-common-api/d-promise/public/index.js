const socket = io()

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', input.value)
    input.value = ''
  }

  // 1.
  try {
    const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz')
    console.log(response.status) // 'ok'
  } catch (e) {
    // the server did not acknowledge the event in the given delay
  }
})
