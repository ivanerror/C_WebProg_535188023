const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const { update, count } = require("../models/image");
const { route } = require("./insframeAPI");
const { image } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = require("../multerConfig");
const cloudinary = require("../cloudinaryConfig");

router.get("/collection/@:username", auth.checkAuthNext, async (req, res) => {
  username = req.params.username;
  var User = {};
  var myUser = {};
  var logged = false;
  var isMyProfile = false;

  try {
    viewUser = await user.findOne({
      username: username,
    });
    countPhoto = await Image.find({author : req.user.id})
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
      count : countPhoto.length,
      tabMode : "collection",
      logged: logged,
      User: User,
      viewUser: viewUser,
      imageList: images,
      isMyProfile : isMyProfile
    });
  } catch (error) {
    // res.redirect("/404");
    res.json({error:error.message})
  }
});

router.get("/photos/@:username", auth.checkAuthNext, async (req, res) => {
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
      author: viewUser._id,
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
      count : images.length,
      tabMode : "photo",
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

const multerConf = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/img/uploads");
    },
    filename: function (req, file, cb) {
      const parts = file.mimetype.split("/")[1];
      cb(null, file.fieldname + "-" + Date.now() + "." + parts);
    },
    fileFilter: function (req, file, next) {
      if (!file) {
        cb();
      }
      const image = file.mimetype.startsWith("image/");
      if (image) {
        cb({ message: "File Done" }, true);
      } else {
        cb({ message: "File type not supported" }, false);
      }
    },
  }),
};

router.post(
  "/uploadimg",
  multer(multerConf).single("photo"), auth.checkAuthNext,
  async (req, res) => {
    if (req.file) {
      req.body.photo = req.file.filename;
      const result = await cloudinary.uploader.upload(
        "./public/img/uploads/" + req.file.filename
      );
      const id = req.user.id;
      const updated = await user.findOneAndUpdate(
        { _id: id },
        {
          img_profile: result.url,
        }
      );
      res.redirect('/profile/edit')
    }
  }
);

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
