const {Router} = require("express");
const router = Router();
const {User} = require("./../models/db");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const { userSchema, loginSchema } = require("../models/types");

router.get('/verify', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) throw new Error();
      const {username, firstName, lastName} = user;
      
      res.json({
        valid: true,
        "user": {
            username,
            firstName,
            lastName
        }
      });
    } catch (error) {
      res.status(401).json({ valid: false });
    }
});

router.post("/signup", async (req, res) => {
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

    const {username, firstName, lastName} = newUser;

    const token = jwt.sign({
        userId
    }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
        "msg": "User created successfully",
        "token": "Bearer " + token,
        userId,
        "user": {
            username,
            firstName,
            lastName
        }
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

        const {username, firstName, lastName} = existingUser;

        res.status(200).json({
            "token": "Bearer " + token,
            userId,
            "user": {
                username,
                firstName,
                lastName
            }
        })
    }else{
        res.status(401).json({
            "msg": "Incorrect Password"
        })
    }    
})

module.exports = router;