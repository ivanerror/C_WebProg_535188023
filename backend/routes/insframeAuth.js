require("dotenv").config();
const express = require("express");
const router = express.Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./auth");

//router route /sign/:route

router.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    const User = await user.findOne({ username: username });
    console.log(User);
    if (User) {
      console.log(User.password);
      console.log(password);
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
        return;
      }
      console.log("invalid cred1");
    } else {
      console.log("invalid cred2");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/:mode", auth.checkAuthNext, (req, res) => {
  if (req.isAuthenticated) {
    res.redirect('/')
  } else {
    let mode = "";
    if (req.params.mode == "in") {
      mode = "";
    } else if (req.params.mode == "up") {
      mode = "sign-up-mode";
    }
    res.render("login", { layout: false, mode: mode });
  }
});

// log out

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
