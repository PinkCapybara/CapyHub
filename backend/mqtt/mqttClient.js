const mqtt = require('mqtt');
const EventEmitter = require('events');
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
        qos: 0,
        retain: false
    }
});

const mqttEmitter = new EventEmitter();

client.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  client.subscribe("devCapy");
});

client.on("message", (topic, payload) => {
  const [deviceId, topicName] = topic.split("/");
  const [type, id, data] = payload.toString().split("_");

  mqttEmitter.emit(type, id, data );
});

client.on('error', (err) => console.log('MQTT Error:', err));

client.on("offline", () => {
  console.warn("MQTT Client Offline. Reconnecting...");
  if (!client.reconnecting) {
    setTimeout(() => client.reconnect(), 5000);
  }
});

client.on('close', () => console.log('MQTT Connection Closed'));

module.exports ={ 
  mqttClient: client,
  mqttEmitter
}