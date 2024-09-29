const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express app
const app = express();
app.use(express.raw({ type: 'text/plain' })); // Handle plain text content

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

let mainSocket;
// Handle WebSocket connection
wss.on('connection', (ws) => {
  console.log('New client connected');

  mainSocket = ws;

  // Send a welcome message when a client connects
  ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    // Broadcast message back to all connected clients, including sender
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Client says: ${message}`);
      }
    });
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Define a basic HTTP route for testing
app.get('/', (req, res) => {
  res.send('WebSocket server is running!');
});

app.post("/send", (req, res) => {
  if (mainSocket && mainSocket.readyState === WebSocket.OPEN) {
    mainSocket.send(req.body.toString());
    res.send("Message sent to WebSocket client");
  } else {
    res.status(500).send("No active WebSocket connection");
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
