const WebSocket = require('ws');

const socket = new WebSocket('ws://websocket-servertest.azurewebsites.net/');

socket.on('open', () => {
  console.log('Conectado ao servidor WebSocket');

  socket.send('Olá, servidor WebSocket!');

});

socket.on('message', (message) => {
  console.log(`Recebido: ${message}`);
});

socket.on('close', () => {
  console.log('Desconectado do servidor WebSocket');
});
