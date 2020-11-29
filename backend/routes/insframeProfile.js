const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const { update } = require("../models/image");

router.get("/@:username", auth.checkAuthNext, async (req, res) => {
  username = req.params.username;
  var User = {};
  var myUser = {};
  var logged = false;
  var isMyProfile = false;

  try {
    viewUser = await user.findOne({
      username: username,
    });
    images = await Image.find({
      collect_by: viewUser._id,
    }).populate("author", "username email biography");
    if (req.isAuthenticated) {
      User = await user.findOne({
        _id: req.user.id
      });
      if (viewUser._id == req.user.id) isMyProfile = true;
      logged = true
      if (!viewUser || !images || !User) throw new Error("...");
    } else {
      if (!viewUser || !images) throw new Error("...");
    }
    res.render("profile", {
      logged: logged,
      User: User,
      viewUser: viewUser,
      imageList: images,
      isMyProfile : isMyProfile
    });
  } catch (error) {
    res.redirect("/404");
    // res.json({error:error.message})
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
    res.redirect("/404");
  }
});

router.post("/update", auth.checkAuth, async (req, res) => {
  try {
    const id = req.user.id;
    const updated = await user.findOneAndUpdate(
      { _id: id },
      {
        email: req.body.email,
        biography: req.body.biography,
        location: req.body.location,
        website: req.body.website,
      }
    );
    res.redirect("/profile/edit");
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
