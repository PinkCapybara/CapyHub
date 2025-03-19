const {Router} = require("express");
const router = Router();
const {User} = require("./../models/db");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const { userSchema, loginSchema } = require("../models/types");

router.post("/signup", async (req, res) => {
    // res.send("debug");
    const inpBody = req.body;
    const {success} = userSchema.safeParse(inpBody);
    if(!success){
        res.status(412).json({
            "msg": "Invalid inputs"
        })
        return;
    }

    const userExists = await User.findOne({
        username: inpBody.username
    })

    if(userExists){
        res.status(412).json({
            "msg": "Username already in use"
        })
        return;
    }

    const newUser = new User(
        inpBody
    ) 

    await newUser.save();
    const userId = newUser._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
        "msg": "User created successfully",
        "token": "Bearer " + token
    })
})

router.post("/signin", async (req, res) => {
    const inpBody = req.body;
    const {success} = loginSchema.safeParse(inpBody);
    if(!success){
        res.status(412).json({
            "msg": "Invalid inputs"
        })
        return;
    }

    const existingUser = await User.findOne({
        username: inpBody.username
    });

    if(!existingUser){
        res.status(412).json({
            "msg": "Username doesn't exist"
        })
        return;
    }

    const verified = await existingUser.validatePassword(inpBody.password);

    if(verified){
        const userId = existingUser._id;

        const token = jwt.sign({
            userId
        }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            "token": "Bearer " + token
        })
    }else{
        res.status(401).json({
            "msg": "Incorrect Password"
        })
    }    
})

module.exports = router;