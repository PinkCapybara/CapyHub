const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });
const apiRouter = require("./routes/index"); 
const http = require('http');
const { initWebSocket } = require("./controllers/socketManager");

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

app.use("/", (req,res) => {
    res.status(200).json({msg: "All good"});
});

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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(3000, () => {
    console.log('Server & WebSocket running on port 3000');
});
  