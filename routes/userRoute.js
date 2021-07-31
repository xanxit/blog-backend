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
    } else {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      if (!User.findOne({ email:req.body.email })) {
        var email = req.body.email;
        var mailOptions = {
          from: "crashxdevelopers@gmail.com",
          to: email,
          subject: "Welcome to the blog website.",
          html: `<h2> You have been registered as an Admin to the blog website.</h2><br><p>Now you can create, update, delete the blogs in the website.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          try {
            console.log(info);
          } catch {
            console.log(error);
          }
        });
      }
    } 
    const user = new User({
        name: req.body.name,
        email: req.body.email,  
        password: bcrypt.hashSync(req.body.password, 10),
        confirmpassword: bcrypt.hashSync(req.body.confirmpassword, 10)
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
    name: user.name,
    email: user.email,
    phone: user.phone,
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
          name: user.name,
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