const jwt = require("jsonwebtoken");
require('dotenv').config();
const {User} = require("../models/db");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({
            "msg": "Unauthorized"
        })
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const userExists = await User.findOne({_id: decoded.userId});
        if(!userExists){
            res.status(403).json({
                "msg": "Unauthorized, user doesn't exist"
            })
            return;
        }
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({
            "msg": "Unauthorized"
        })
        return;
    }
}

module.exports =  authMiddleware
