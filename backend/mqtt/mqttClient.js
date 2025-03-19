const mqtt = require('mqtt');
require('dotenv').config();

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    will: {
        topic: 'devCapy',
        payload: 'offline',
        qos: 1,
        retain: false
    }
});

mqttClient.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  client.subscribe("devCapy");
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message: ${message} from topic: ${topic}`);
});

const sendCommand = (deviceId, payload) => {
  client.publish(`CapyHub/${deviceId}/command`, payload);
};

module.exports ={ 
  sendCommand,
  mqttClient
}