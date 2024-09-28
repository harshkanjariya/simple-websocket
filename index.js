const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an Express app
const app = express();
app.use(express.raw({ type: 'text/plain' })); // Handle plain text content

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server instance
const io = new Server(server);

let mainSocket;
// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  mainSocket = socket;
  // Handle incoming messages from the client
  socket.on('message', (message) => {
    console.log(`Received message => ${message}`);

    // Broadcast message back to all connected clients, including sender
    io.emit('message', `Client ${socket.id} says: ${message}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Send a welcome message when a client connects
  socket.emit('message', 'Welcome to the Socket.IO server!');
});

// Define a basic HTTP route for testing
app.get('/', (req, res) => {
  res.send('Socket.IO server is running!');
});

app.post("/send", (req, res) => {
  mainSocket.emit("message", req.body.toString());
  res.send("ok");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
