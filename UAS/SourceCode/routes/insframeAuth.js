require("dotenv").config();
const express = require("express");
const router = express.Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./auth");
const Joi = require("joi");
const { valid } = require("joi");

//router route /sign/:route

router.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    const User = await user.findOne({ username: username });
    console.log(User);
    if (User) {
      const authResult = await bcrypt.compare(password, User.password);
      if (authResult) {
        const token = jwt.sign(
          {
            id: User._id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token);
        res.redirect("/");
        req.session.destroy()
        return;
      }
      req.session.logMessage =
        "Login failed : Invalid username or password";
      res.redirect("/sign/in");
    } else {
      req.session.logMessage =
        "Login failed : Invalid username or password";
      res.redirect("/sign/in");
    }
  } catch (error) {
    req.session.logMessage =
      "Login failed : Invalid username or password";
    res.redirect("/sign/in");
  }
});

router.post("/register", async (req, res) => {
  try {
    const validation = await regSchema.validateAsync(req.body);
    const emailValidate = await user.findOne({email : validation.email})
    const usernameValidate = await user.findOne({username : validation.username})
    if(usernameValidate) throw new Error(`username : ${validation.username} has already been taken`)
    if(emailValidate) throw new Error(`email : ${validation.email} has already been taken`)
    const password = await bcrypt.hash(validation.password, 10);
    const newUser = new user({
      username: validation.username,
      email: validation.email,
      password: password,
    });

    const userLists = await newUser.save();
    if (!userLists) throw new Error("Something went wrong");
    res.status(200).redirect("/sign/in");
    req.session.destroy();
    res.redirect("/sign/in");
  } catch (error) {
    req.session.regMessage = error.message;
    res.redirect("/sign/up");
  }
});

// log out
router.get("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.redirect("/");
});

router.get("/:mode", auth.checkAuthNext, (req, res) => {
  let regMessage = ""
  let logMessage = ""
  if (req.isAuthenticated) {
    res.redirect("/");
  } else {
    let mode = "";
    if (req.params.mode == "in") {
      logMessage = req.session.logMessage;
      mode = "";
    } else if (req.params.mode == "up") {
      regMessage = req.session.regMessage;
      mode = "sign-up-mode";
    }
    res.render("login", {
      layout: false,
      mode: mode,
      regMessage: regMessage,
      logMessage: logMessage,
    });
    req.session.destroy()
  }
});

// Validation

const regSchema = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  email: Joi.string().min(6).max(254).required().email(),
  password: Joi.string().min(6).max(128).required(),
});

module.exports = router;
