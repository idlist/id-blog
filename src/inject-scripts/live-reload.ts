const ws = new WebSocket('ws://localhost:12345')

ws.addEventListener('open', () => { ws.send('connected') })
ws.addEventListener('message', () => { window.location.reload() })

export { }