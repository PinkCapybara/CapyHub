const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./routes/index"); 
const http = require('http');
require('./controllers/eventHandlers'); // Register handlers first
require('./mqtt/mqttClient'); // Then start MQTT connection
const { initWebSocket } = require("./controllers/socketManager");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.status(404).json({
        "msg": "Route not found"
    })
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        "msg": "Something went wrong"
    })
})


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(3000, () => {
    console.log('Server & WebSocket running on port 3000');
});
  