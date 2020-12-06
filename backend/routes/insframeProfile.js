const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const { update } = require("../models/image");
const { route } = require("./insframeAPI");

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
    }).populate("author", "username email biography img_profile");
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

router.post('/savecollect', auth.checkAuthNext, async (req,res) => {
  try {
    if(req.isAuthenticated) {
      newCollection = await Image.findByIdAndUpdate(req.body.id, {
        $push : {
          collect_by : req.user.id
        }
      })
      res.redirect('/photo/' + req.body.id)
    } else {
      res.redirect('/sign/in')
    }
  } catch (error) {
    // res.redirect('/404')
    res.json({error : error.message})
  }
})

router.post('/deletecollect', auth.checkAuthNext, async (req, res) => {
  try {
    if(req.isAuthenticated) {
      deleteCollection = await Image.findByIdAndUpdate(req.body.id, {
        $pull : {
          collect_by : req.user.id
        }
      })
      res.redirect('/photo/' + req.body.id)
    } else {
      res.redirect('/sign/in')
    }
  } catch (error) {
    res.redirect('/404')
  }
})

module.exports = router;
