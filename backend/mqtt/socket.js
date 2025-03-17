const socketIO = require("socket.io");

let io;

module.exports.init = (server) => {
  io = socketIO(server, { cors: { origin: "*" } });

  require("./mqttClient").on("message", (topic, message) => {
    io.emit("device-update", { topic, message: message.toString() });
  });

  console.log("WebSocket initialized");
};

module.exports.io = () => io;