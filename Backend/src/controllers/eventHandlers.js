const { Device, Element } = require("../models/db");
const { mqttEmitter } = require("../mqtt/mqttClient");
const { updateDeviceStatus } = require("./deviceStatus");
const { checkNotificationConditions } = require("./notificationCheck");
const { broadcast } = require("./socketManager");

// 1. Handle Sensor Data (sens_elementid_data)
mqttEmitter.on("sens", async (elementId, data) => {
    try {
        const element = await Element.findById(elementId);
        if (!element) throw new Error(`Element with ID ${elementId} not found`);

        console.log(`${element.name} reported data: ${data}`);
        element.value = Number(data);
        await element.save();

        broadcast({
            type: 'SENSOR_UPDATE',
            data: { elementId, data }
        });

        checkNotificationConditions(element.toObject());
    } catch (error) {
        console.log(`Error in sensor event handler: ${error.message}`);
    }
});

// 2. Handle Signal Strength (sigstr_deviceid_data)
mqttEmitter.on("sigstr", async (deviceId, data) => {
    try {
        console.log("Sigstr event handler running");
        const device = await Device.findById(deviceId);
        if (!device) throw new Error(`Device with ID ${deviceId} not found`);

        console.log(`${device.name} signal strength: ${data}`);
        const strength = parseInt(data);
        updateDeviceStatus(deviceId, { strength });

        broadcast({
            type: 'SIGSTR_UPDATE',
            data: { deviceId, data }
        });
    } catch (error) {
        console.log(`Error in signal strength event handler: ${error.message}`);
    }
});

// 3. Handle Device Status (status_deviceid_on/off)
mqttEmitter.on("status", async (deviceId, data) => {
    try {
        console.log("Status event handler running");
        const device = await Device.findById(deviceId);
        if (!device) throw new Error(`Device with ID ${deviceId} not found`);

        console.log(`${device.name} is now: ${data}`);
        const isOnline = data.trim().toLowerCase() === "online";

        console.log(`Updating device status for ${deviceId} to online: ${isOnline}`);

        updateDeviceStatus(deviceId, { isOnline });

        broadcast({
            type: 'STATUS_UPDATE',
            data: { deviceId, data }
        });
    } catch (error) {
        console.log(`Error in status event handler: ${error.message}`);
    }
});

// 4. Handle Responses (resp_elementid_data)
mqttEmitter.on("resp", async (elementId, data) => {
    try {
        const element = await Element.findById(elementId);
        if (!element) throw new Error(`Element with ID ${elementId} not found`);

        console.log(`Received response from ${element.name}: ${data}`);

        if (element.subType !== "push") {
            const newValue = (element.subType === "color_picker") ? data.toString() : Number(data);
            element.value = newValue;
            await element.save();
        }

        broadcast({
            type: 'RESPONSE',
            data: { elementId, data }
        });
    } catch (error) {
        console.log(`Error in response event handler: ${error.message}`);
    }
});