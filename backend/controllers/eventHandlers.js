const { Device, Element } = require("../models/db");
const { mqttEmitter } = require("../mqtt/mqttClient");
const { updateDeviceStatus } = require("./deviceStatus");
const { checkNotificationConditions } = require("./notificationCheck");

// 1. Handle Sensor Data (sens_elementid_data)
mqttEmitter.on("sens", async ( elementId, data ) => {
    const element = await Element.findById(elementId);
    console.log(`${element.name} reported data: ${data}`);

    element.value = Number(data);
    await element.save();
    checkNotificationConditions(element.lean()); 
});

// 2. Handle Signal Strength (sigstr_deviceid_data)
mqttEmitter.on("sigstr", async ( deviceId, data ) => {
    const device = await Device.findById(deviceId);
    console.log(`${device.name} signal strength: ${data}`);
    const strength = parseInt(data);
    updateDeviceStatus(deviceId, {strength} ); 
});

// 3. Handle Device Status (status_deviceid_on/off)
mqttEmitter.on("status", async ( deviceId, data ) => {
    const device = await Device.findById(deviceId);
    console.log(`${device.name} is now: ${data}`);
    const isOnline = (data.toString()==="online") ? true: false ;
    updateDeviceStatus(deviceId, {isOnline} ); 
});

// 4. Handle Responses (resp_elementid_data)
mqttEmitter.on("resp", async  ( elementId, data ) => {
    const element = await Element.findById(elementId);
    console.log(`Received response from  ${element.name}: ${data}`);

    if(element.subType !== "push"){
        const newValue = (element.subType === "color_picker") ? data.toString(): Number(data);
        element.value = newValue;
        await element.save();
    }
});