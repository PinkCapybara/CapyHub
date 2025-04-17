const { Router } = require("express");
const { Element, Device, Group, User } = require("../models/db");
const authMiddleware = require("../middleware/authMiddleware");
const { elementSchema } = require("../models/types");
const { mqttClient } = require("../mqtt/mqttClient"); 
const isValidPayload = require("../controllers/isValidPayload");
const router = Router();

// Get all elements across all devices under user's groups
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const devices = await Device.find({ group: { $in: user.groups } });
        const deviceIds = devices.map(d => d._id);
        const elements = await Element.find({ device: { $in: deviceIds } });

        res.json({ elements });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching elements" });
    }
});

// Get a specific element
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const element = await Element.findById(req.params.id);
        if (!element) return res.status(404).json({ msg: "Element not found" });

        const device = await Device.findById(element.device);
        if (!device) return res.status(404).json({ msg: "Device not found" });

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {  
            return res.status(403).json({ msg: "Unauthorized" });
        }

        res.json({ element });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching element" });
    }
});

// Add a new element to a device
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { success } = elementSchema.safeParse(req.body);
        if (!success) return res.status(400).json({ msg: "Invalid element data" });

        const { device, subscribeTopic } = req.body;
        const element = req.body;
        
        const deviceObj = await Device.findById(device);
        if (!deviceObj) return res.status(404).json({ msg: "Device not found" });

        const group = await Group.findById(deviceObj.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        element.deviceName = deviceObj.name;
        element.groupName = group.name;
        element.publishTopic = "devCapy"; 
        element.subscribeTopic = device.toString()+"/"+subscribeTopic;
        const newElement = new Element(element);
        await newElement.save();
        res.status(201).json({ msg: "Element added", element: newElement });
    } catch (error) {
        res.status(500).json({ msg: "Error adding element" });
    }
});

// Update an element and publish command to MQTT
router.put("/:id", authMiddleware, async (req, res) => {
    try {


        const element = await Element.findById(req.params.id);
        if (!element) return res.status(404).json({ msg: "Element not found" });

        const device = await Device.findById(element.device);
        if (!device) return res.status(404).json({ msg: "Device not found" });

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        if(req.body.subscribeTopic){
            req.body.subscribeTopic = req.body.device + "/" + req.body.subscribeTopic
        }

        Object.assign(element, req.body);
        await element.save();

        res.json({ msg: "Element updated", element });
    } catch (error) {
        res.status(500).json({ msg: "Error updating element" });
    }
});

// Delete an element
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const element = await Element.findById(req.params.id);
        if (!element) return res.status(404).json({ msg: "Element not found" });

        const device = await Device.findById(element.device);
        if (!device) return res.status(404).json({ msg: "Device not found" });

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        await Element.findByIdAndDelete(req.params.id);
        res.json({ msg: "Element deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting element" });
    }
});


// Publish payload to the element on respective topic
router.post("/:id/publish", authMiddleware, async (req, res) => {
    try {
        const { payload } = req.body;
        if (!payload) return res.status(400).json({ error: "Payload is required" });

        // Find element
        const element = await Element.findById(req.params.id);
        if (!element) return res.status(404).json({ error: "Element not found" });

        // Verify user has access to the associated device
        const device = await Device.findById(element.device);
        if (!device) return res.status(404).json({ error: "Associated device not found" });

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        // Validate payload based on element type
        const validation = isValidPayload(element, payload);
        if (!validation.valid) return res.status(400).json({ error: validation.error });

        // Publish to MQTT topic
        const topic = element.subscribeTopic;

        const sanitizedPayload = typeof payload === 'string' ? payload : String(payload);
        mqttClient.publish(topic, sanitizedPayload, { qos: 1 });

        res.json({ message: "Command published successfully", topic, payload });
    } catch (error) {
        console.error("Error publishing command:", error);
        res.status(500).json({ error: "Error publishing command" });
    }
});

module.exports = router;
