const socket = io()

// sender
socket.emit('hello', 'world', (response) => {})
