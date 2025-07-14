let socket = null;
let reconnectInterval = 3000;
const WS_URL = import.meta.env.VITE_WS_URL;

export const connectWebSocket = (token, onMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  if (!token) {
    console.log("[WS] No token provided, skipping connection");
    return;
  }

  const url = `${WS_URL}/ws?token=${token}`;
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("[WS] Connected to", url);
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (typeof onMessage === "function") {
        onMessage(message);
      }
    } catch (err) {
      console.error("[WS] Failed to parse message", err);
    }
  };

  socket.onerror = (error) => {
    console.error("[WS] Error:", error);
  };

  socket.onclose = (event) => {
    console.log("[WS] Disconnected:", event.reason);
    // Attempt to reconnect
    setTimeout(() => connectWebSocket(token, onMessage), reconnectInterval);
  };
};

// never used
export const sendMessage = (msg) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  } else {
    console.log("[WS] Cannot send message, socket not open");
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
