const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler (async (req,res,next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }
        //verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //get the user id from token
        const user = await User.findById(verified.id).select("-password")
        //it will give all information of user in the database
        //but we dont required user password to be sent so for that
        if (!user) {
            res.status(401)
            throw new Error("user not found!")
        }
        req.user = user;
        next()
         
    } catch (error) {
        res.status(401)
            throw new Error("Not authorized, please login")
    }
});
module.exports = protect