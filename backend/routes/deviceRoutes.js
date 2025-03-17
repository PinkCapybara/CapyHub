const express = require("express");
const router = express.Router();
const {Device} = require("../models/db");
const client = require("../mqtt/mqttClient");

router.post("/add", async (req, res) => {
  const { name, deviceId, type, elements, group } = req.body;

  const device = new Device({ name, deviceId, type, elements, group });
  await device.save();
  res.json({ message: "Device added!", device });
});

router.post("/control", async (req, res) => {
  const { deviceId, action } = req.body;
  const device = await Device.findOne({ deviceId });

  if (!device) return res.status(404).json({ error: "Device not found" });

  const payload = action === "on" ? device.elements[0].onPayload : device.elements[0].offPayload;
  client.publish(`homeautomation/${deviceId}/command`, payload);

  res.json({ message: `Command sent: ${payload}` });
});

module.exports = router;