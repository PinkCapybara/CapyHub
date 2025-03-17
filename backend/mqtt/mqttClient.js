const mqtt = require('mqtt');
require('dotenv').config();

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    will: {
        topic: 'dev_status',
        payload: 'offline',
        qos: 1,
        retain: false
    }
});

mqttClient.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  client.subscribe("homeautomation/+/status");
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message: ${message} from topic: ${topic}`);
});

module.exports = mqttClient