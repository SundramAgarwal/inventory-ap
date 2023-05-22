const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser,changePassword,forgotPassword,resetPassword} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
// this register  user is a function is supposed to fire 
// when ever we make a request to this user userRoute i.e /api/users
// and then finally /register so when ever we make a request to this end point 
// we want this function to fire and this function is supposed
// to be in controller folder if we were going to pay attention 
// to suppression of concerns, which is very important in development
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser",protect,getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser",protect,updateUser);
router.patch("/changepassword",protect,changePassword);
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword/:resetToken",resetPassword);

module.exports = router;