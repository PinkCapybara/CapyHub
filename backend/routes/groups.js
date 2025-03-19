const express = require("express");
const { Group, User, Device } = require("../models/db");
const authMiddleware = require("../middleware/authMiddleware");
const { groupSchema } = require("../models/types");
const router =  express.Router();

// Get all groups for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("groups");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ groups: user.groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching groups" });
    }
});

// Get a specific group
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        const user = await User.findById(req.userId);
        if (!user.groups.some((groupId) => groupId.equals(group._id))) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        res.json({ group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching group" });
    }
});

// Create a new group
router.post("", authMiddleware, async (req, res) => {
    try {
        const { success } = groupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ msg: "Invalid group data" });
        }

        const { name } = req.body;
        const newGroup = new Group({ name, owner: req.userId, devices: [] });
        await newGroup.save();

        await User.findByIdAndUpdate(req.userId, { $push: { groups: newGroup._id } });

        res.status(201).json({ msg: "Group created", group: newGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating group" });
    }
});

// Update a group
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { success } = groupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ msg: "Invalid group data" });
        }

        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        if (group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        Object.assign(group, req.body);
        await group.save();

        res.json({ msg: "Group updated", group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating group" });
    }
});

// Delete a group
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        if (group.owner.toString() !== req.userId) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        // Remove devices in the group
        await Device.deleteMany({ group: group._id });

        // Remove the group from the user's groups
        await User.findByIdAndUpdate(req.userId, { $pull: { groups: group._id } });

        await Group.findByIdAndDelete(req.params.id);

        res.json({ msg: "Group deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting group" });
    }
});

module.exports = router;
