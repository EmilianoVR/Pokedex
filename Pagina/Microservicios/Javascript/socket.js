const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Cliente conectado');

  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido: %s', message);
  });

  ws.send('¡Conexión establecida con el servidor!');
});
