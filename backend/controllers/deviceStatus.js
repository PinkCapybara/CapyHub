class DeviceStatus {
    constructor(deviceId, isOnline = false, strength = 0) {
        this.deviceId = deviceId;
        this.isOnline = isOnline;
        this.strength = strength;
    }
}

const deviceStatusList = [];

const updateDeviceStatus = (deviceId, updates) => {
    let device = deviceStatusList.find(d => d.deviceId === deviceId);

    if (!device) {
        device = new DeviceStatus(deviceId);
        Object.assign(device, updates);
        deviceStatusList.push(device);
    }else{
        Object.assign(device, updates);
    }
    
    console.log(`Device ${deviceId} status updated:`, device);
};

module.exports = { updateDeviceStatus, deviceStatusList };
