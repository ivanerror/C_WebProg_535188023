const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");

router.get("/@:username", auth.checkAuthNext, async (req, res) => {
  username = req.params.username;
  var User = {};
  var myUser = {};
  var logged = false;
  var isMyProfile = false;
  if (req.isAuthenticated) {
    try {
      User = await user.findOne({
        username: username,
      });
      viewUser = await user.findOne({
        username: username,
      });
      if (!viewUser || !User) throw new Error("No Image Lists");
      if (myUser._id == req.user.id) isMyProfile = true;
      logged = true;
      res.render("profile", { logged: logged, User: User, viewUser: viewUser });
    } catch (error) {
      res.redirect("/404");
    }
  } else {
    try {
      viewUser = await user.findOne({
        username: username,
      });
      if (!viewUser) throw new Error("No Image Lists");

      res.render("profile", { logged: logged, User: User, viewUser: viewUser });
      console.log(viewUser);
    } catch (error) {
      res.redirect("/404");
    }
  }
});

router.get("/edit", auth.checkAuth, async (req, res) => {
  try {
    User = await user.findById(req.user.id);
    res.render("edit-profile", {
      User: User,
      logged: true,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
