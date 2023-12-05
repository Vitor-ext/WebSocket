const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Servidor HTTP
const server = http.createServer((req, res) => {
  let filePath;

  // Roteamento para diferentes URLs
  if (req.url === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, req.url);
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

// Servidor WebSocket
const wss = new WebSocket.Server({ server });

// Armazenar mensagens recebidas
const messages = [];

wss.on('connection', (socket) => {
  console.log('Cliente conectado ao WebSocket!');

  // Enviar mensagens existentes ao novo cliente
  messages.forEach((message) => {
    socket.send(`Histórico: ${message}`);
  });

  socket.on('message', (message) => {
    console.log(`Recebido no WebSocket: ${message}`);

    // Armazenar a mensagem
    messages.push(message);

    // Enviar a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Cliente disse: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log('Cliente desconectado do WebSocket');
  });
});

const PORT_HTTP = 8080;

server.listen(PORT_HTTP, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${PORT_HTTP}`);
});

wss.on('listening', () => {
  console.log(`Servidor WebSocket rodando em ws://localhost:${PORT_HTTP}`);
});
