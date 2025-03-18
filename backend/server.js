const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const apiRouter = require("./routes"); // edit this
const client = require("./mqtt/mqttClient");
const socket = require("./mqtt/socket");

const app = express();
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


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

socket.init(server);