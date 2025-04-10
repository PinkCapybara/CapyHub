const { Router } = require("express");

const authRouter = require("./auth");
const groupRouter = require("./groups");
const deviceRouter = require("./devices");
const elementRouter = require("./elements");

const router = Router();

router.use("/auth", authRouter);
router.use("/groups", groupRouter);
router.use("/devices", deviceRouter);
router.use("/elements", elementRouter);

module.exports = router;