const { Router } = require("express");
const { Device, Group, User } = require("../models/db");
const authMiddleware = require("../middleware/authMiddleware");
const { deviceSchema } = require("../models/types");
const router = Router();

// Get all devices for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) { 
            return res.status(404).json({ msg: "User not found" });
        }

        const devices = await Device.find({ group: { $in: user.groups } });
        
        res.json({ devices });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching devices" });
    }
});

// Getting a specific device
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const device = await Device.findById(req.params.id);
        
        if(device){
            if (!user.groups.some((groupId) => groupId.equals(device.group)))  {
                return res.status(403).json({ msg: "Unauthorized" });
            }

            return res.json({ device });
        }else{
            return res.status(404).json({msg: "Device not found"});
        }

    } catch (error) {
        res.status(500).json({ msg: "Error fetching devices" });
    }
});

// Add a new device
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { success } = deviceSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ msg: "Invalid device data" });
        }

        const { name, group } = req.body;
        const groupExists = await Group.findOne({ _id: group, owner: req.userId });
        if (!groupExists) {
            return res.status(403).json({ msg: "Group not found or unauthorized" });
        }

        const newDevice = new Device({ name, group });
        await newDevice.save();

        await Group.findByIdAndUpdate(group, { $push: { devices: newDevice._id } });

        res.status(201).json({ msg: "Device added", device: newDevice });
    } catch (error) {
        res.status(500).json({ msg: "Error adding device" });
    }
});

// Update a device
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { success } = deviceSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ msg: "Invalid device data" });
        }

        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ msg: "Device not found" });
        }

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        Object.assign(device, req.body);
        await device.save();

        res.json({ msg: "Device updated", device });
    } catch (error) {
        res.status(500).json({ msg: "Error updating device" });
    }
});

// Delete a device
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ msg: "Device not found" });
        }

        const group = await Group.findById(device.group);
        if (!group || group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        await Group.findByIdAndUpdate(device.group, { $pull: { devices: req.params.id } });

        await Device.findByIdAndDelete(req.params.id);
        res.json({ msg: "Device deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting device" });
    }
});

module.exports = router;