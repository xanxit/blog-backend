const express = require("express");
const bcrypt = require("bcrypt");
const expressAsyncHandler = require("express-async-handler");
const userRouter = express.Router();
const User = require("../models/user");
const generateToken = require("../utils");
const nodemailer = require("nodemailer");
const authmiddleware = require("../middleware/authmiddleware");
require("dotenv").config();
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const Username = await User.findOne({ email: req.body.email });
    if (Username) {
      res.status(401).json("User already exist!");
    }
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,  
        password: bcrypt.hashSync(req.body.password, 8),
        confirmpassword: bcrypt.hashSync(req.body.confirmpassword, 8)
  })
  try {
    if (req.body.password === req.body.confirmpassword) {
      user.save();
    }
  } catch (error) {
    res.json("Password does not match with confirm Password");
  }

  res.status(200).json({
    _id: user._id,
    name: user.firstname,
    email: user.email,
    token: generateToken(user),
  });
  }));

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          firstname: user.firstname,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).json({ message: "Invalid Email or password" });
  })
);

module.exports=userRouter;