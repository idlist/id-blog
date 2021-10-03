const ws = new WebSocket('ws://localhost:12345')

ws.addEventListener('message', () => { window.location.reload() })

export { }