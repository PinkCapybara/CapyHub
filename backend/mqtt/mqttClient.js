const mqtt = require('mqtt');
require('dotenv').config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: 'mqtts', // Force TLS
    port: 8883, 
    rejectUnauthorized: true, // Validate server certificate
    will: {
        topic: 'devCapy',
        payload: 'offline',
        qos: 1,
        retain: false
    }
});

client.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  client.subscribe("devCapy");
});

client.on("message", (topic, message) => {
  console.log(`Received message: ${message} from topic: ${topic}`);
});

const sendCommand = (deviceId, payload) => {
  client.publish(`CapyHub/${deviceId}/command`, payload);
};

module.exports ={ 
  sendCommand,
  mqttClient: client
}