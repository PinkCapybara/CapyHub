let socket = null;
let reconnectInterval = 3000;
let onMessageCallback = null;
const WS_URL = import.meta.env.VITE_WS_URL;

export const connectWebSocket = (token, onMessage) => {
  if (!token) {
    console.warn('[WS] No token provided, skipping connection');
    return;
  }

  onMessageCallback = onMessage;
  const url = `${import.meta.env.VITE_WS_URL}/ws?token=${token}`;
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('[WS] Connected to', url);
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (typeof onMessageCallback === 'function') {
        onMessageCallback(message);
      }
    } catch (err) {
      console.error('[WS] Failed to parse message', err);
    }
  };

  socket.onerror = (error) => {
    console.error('[WS] Error:', error);
  };

  socket.onclose = (event) => {
    console.warn('[WS] Disconnected:', event.reason);
    // Attempt to reconnect
    setTimeout(() => connectWebSocket(token, onMessage), reconnectInterval);
  };
};

/**
 * Send a message over the WebSocket
 * @param {object} msg - message object to send
 */
export const sendMessage = (msg) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  } else {
    console.warn('[WS] Cannot send message, socket not open');
  }
};

/**
 * Close the WebSocket connection
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
