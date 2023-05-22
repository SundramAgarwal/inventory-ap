const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const token = require("../models/tokenModel");
const crypto = require("crypto"); 
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};
// Register User
const registerUser = asyncHandler( async (req,res) => {
    const {name,email,password} = req.body

    // validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields!")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be up to 6 characters!")
    }
    if (password.length > 23) {
        res.status(400)
        throw new Error("Password must not be more than 23 characters!")
    }
    // check if user email already exits
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error("Email has already been registered!")
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate Token
    const token = generateToken(user._id);

    // send HTTP only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 86400)), //1 day
        sameSite: "none",  // they are executed when deployed
        secure: true
    });

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token,
        });
    } else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
});

// Login user
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    // validate request
    if(!email || !password) {
        res.status(400);
        throw new Error("Please add email and password!");
    }

    // check if user exists
    const user = await User.findOne({email})
    if(!user) {
        res.status(400);
        throw new Error("User not found please sign up!");
    }

    // User exists , check if pasword is corect
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    
    // Generate Token
    const token = generateToken(user._id);

    // send HTTP only cookie
    if (passwordIsCorrect) {
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 86400)), //1 day
            sameSite: "none",  // they are executed when deployed
            secure: true
        }); 
    }

    if (user && passwordIsCorrect) {
        const {_id, name, email, photo, phone, bio} = user
            res.status(200).json({
            _id, name, email, photo, phone, bio, token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password!")
    }
});

//logout user
const logout = asyncHandler(async (req,res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "none",  // they are executed when deployed
        secure: true,
    }); 
    return res.status(200).json({message: "Successfully Logged Out"})
});

//get user data
const getUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)
    if(user) {
        const {_id,name,email,photo,phone,bio} = user;
        res.status(200).json({
            _id,name,email,photo,phone,bio,
        });
    } else {
        res.status(400);
        throw new Error("User not found!")
    }
});

//get login status
const loginStatus = asyncHandler (async (req,res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    } 
     // verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true)
    }
    return res.json(false)
});

//update user
const updateUser = asyncHandler (async (req,res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const {name,email,photo,phone,bio} = user;
        user.email = email,
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email, 
            photo: updatedUser.photo, 
            phone: updatedUser.phone, 
            bio: updatedUser.bio,
        })
    } else {
        res.status(404)
        throw new Error("User not Found!")
    }
});

//change password
const changePassword = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    const {oldPassword, password} = req.body
    if (!user) {
        res.status(400);
        throw new Error("User not found please signup")
    }
    //validate
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add old and new password!")
    }

    //check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    // save new password
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password changed successfully!")
    } else {
        res.status(400);
        throw new Error("Old password is incorrect!");
    }
});

//forget password
const forgotPassword = asyncHandler(async (req,res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user) {
        res.status(404)
        throw new Error("user does not exist")
    }

    //Delete token if it exists in DB
    let token = await Token.findOne({
        userId: user._id
    })
    if (token) {
        await token.deleteOne()
    }

    // create reset token
    let resetToken = crypto
    .randomBytes(32)
    .toString("hex") + user._id

    //hash token before saving to DB
    // below sha256 is the name of the algorithm to hash
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    // save token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30*(60*1000) //thirty minutes
    }).save()

    // construct reset url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    //reset email
    const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is only available for 30 minutes.</p>

    <a href = ${resetUrl} clicktracking = off>
    ${resetUrl}</a>

    <p>Regards...</p>
    <p>inventory-ap team</p>
    `;

    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject,message,send_to,sent_from)
        res.status(200).json({
            success: true,
            message: "Reset Email Sent"
        })
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent please try again")
    }
});

//reset password
const resetPassword = asyncHandler(async(req,res)=> {
    const {password} = req.body
    const {resetToken} = req.params

    // hash the token then compare to that one in DB
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    //find token in DB

    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()} //gt means greater than
    })

    if (!userToken) {
        res.status(404)
        throw new Error("Invalid or expired token!")
    }

    //find user
    const user = await User.findOne({_id: userToken.userId})
    user.password = password
    await user.save()
    res.status(200).json({
        message: "Password Reset successfully ,please login"
    })

});
 
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
};