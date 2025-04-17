const WebSocket = require('ws');
const { mqttEmitter } = require('../mqtt/mqttClient');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const url = require('url');

let wss;
const clients = new Map(); // Store authenticated clients

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Parse token from query string
    console.log("ws connected");
    const params = url.parse(req.url, true).query;
    const token = params.token.split(" ")[1];

    if (!token) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        ws.userId = decoded.userId;
        clients.set(ws, decoded.userId);
        console.log(`User ${decoded.userId} connected via WS`);
    
        ws.on('close', () => {
          clients.delete(ws);
        });
    
      } catch (err) {
        console.log("JWT verification failed:", err.message);
        ws.close(1008, 'Invalid token');
    }
  });
};

// Broadcast to all authenticated clients
const broadcast = (message) => {
  clients.forEach((userId, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

module.exports = { initWebSocket, broadcast };
