const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const imageAndUser = require("../models/imageAndUser");
const { Mongoose } = require("mongoose");
const moment = require('moment')

router.get("/leaderboard", auth.checkAuthNext, async (req, res) => {
  try {
    Img = await Image.aggregate([
      {
        $group: {
          _id: "$author",
          views: { $sum: "$views" },
          likes: {
            $sum: {
              $cond: {
                if: {
                  $isArray: "$liked_by",
                },
                then: { $size: "$liked_by" },
                else: "NA",
              },
            },
          },
        },
      },
    ]).sort({ views: -1 });

    const leaderboardUser = await user.find({
      _id: {
        $in: Img,
      },
    });

    if (req.isAuthenticated) {
      User = await user.findById(req.user.id);
      res.render("leaderboard", {
        User: User,
        Img: Img,
        leaderboardUser: leaderboardUser,
        page_name: "leaderboard",
        logged: true,
      });
    } else {
      res.render("leaderboard", {
        User: {},
        Img: Img,
        leaderboardUser: leaderboardUser,
        page_name: "leaderboard",
        logged: false,
      });
    }
  } catch (error) {
    res.json({ error: error.message });
    // res.redirect("/404");
  }
});

router.get("/category", auth.checkAuthNext, async (req, res) => {
  const categoryList = await Category.find();

  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id);

    console.log(req.user.id);
    res.render("category", {
      categoryLists: categoryList,
      page_name: "category",
      logged: true,
      User: User,
    });
  } else {
    res.render("category", {
      categoryLists: categoryList,
      page_name: "category",
      logged: false,
      User: {},
    });
  }
});

router.get("/", auth.checkAuthNext, async (req, res) => {
  try {
    const images = await Image.find().populate(
      "author",
      "username img_profile"
    );
    const categories = await Category.find().limit(6);

    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("index", {
        imageList: images,
        categories: categories,
        navbarMode: "home",
        page_name: "home",
        logged: true,
        User: User,
      });
    } else {
      res.render("index", {
        imageList: images,
        categories: categories,
        navbarMode: "home",
        page_name: "home",
        logged: false,
        User: {},
      });
    }
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/category/:categoryName", auth.checkAuthNext, async (req, res) => {
  const categoryName = req.params.categoryName;
  const categories = {};
  try {
    categoryData = await Category.findOne({ category: categoryName });
    data = await Image.find({
      _id: {
        $in: categoryData.images,
      },
    }).populate("author", "username img_profile");

    console.log(data.source);
  } catch (error) {
    res.redirect("/404");
  }
  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id);
    res.render("select-category", {
      categorySelect: categoryData,
      imageList: data,
      page_name: "category",
      logged: true,
      User: User,
    });
  } else {
    res.render("select-category", {
      categorySelect: categoryData,
      imageList: data,
      page_name: "category",
      logged: false,
      User: {},
    });
  }
});

router.get("/photo/:photoName", auth.checkAuthNext, async (req, res) => {
  const photoName = req.params.photoName;
  try {
    photoData = await Image.findByIdAndUpdate(photoName, {
      $inc : {
        views : 1
      }
    });
    data = await user.findOne({
      _id: {
        $in: photoData.author,
      },
    });
    console.log(data.username);
  } catch (error) {
    //res.redirect("/404");
    res.json(error);
  }
  if (req.isAuthenticated) {
    btnCollection = photoData.collect_by.includes(req.user.id);
    console.log(btnCollection);
    User = await auth.getUser(req.user.id);
    res.render("pop-up", {
      photoSelect: photoData,
      uploader: data,
      logged: true,
      User: User,
      btnCollection: btnCollection,
      moment : moment
    });
  } else {
    res.render("pop-up", {
      photoSelect: photoData,
      uploader: data,
      logged: false,
      User: {},
      btnCollection: false,
      moment : moment

    });
  }
});

router.get("/form-data", async (req, res) => {
  const categoryList = await Category.find();
  const userList = await user.find();
  res.render("upload-form", {
    categoryLists: categoryList,
    userLists: userList,
    logged: false,
  });
});

// JSON UPLOADER
// untuk upload upload gambar

router.post("/form-data", async (req, res) => {
  const data = req.body;
  const authorId = data.author;
  const categoryId = [].concat(data.category);
  const newCategory = await Category.find({
    _id: {
      $in: categoryId,
    },
  });
  const categoryName = newCategory.map((category) => category.category);
  const newUser = await user.findById(authorId, "username");
  const searchQuery =
    data.title +
    " " +
    data.description +
    " " +
    [].concat(categoryName).join(" ") +
    " " +
    newUser.username;
  try {
    const newImageLists = new Image({
      title: data.title,
      source: data.source,
      detail: {
        description: data.description,
        raw: {
          megapixel: data.megapixel,
          camera: data.camera,
          iso: data.iso,
          ss: data.ss,
          aperture: data.aperture,
        },
      },
      author: data.author,
      searchQuery: searchQuery,
      views: parseInt(data.views),
    });

    const imageLists = await newImageLists.save();
    const selectedCategory = [].concat(data.category);

    const categoryLists = await Category.updateMany(
      {
        _id: {
          $in: selectedCategory,
        },
      },
      { $addToSet: { images: imageLists._id } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.redirect("/form-data");
});

router.get("/search", auth.checkAuthNext, async (req, res) => {
  try {
    const searchQuery = req.query.keyword;
    const images = await Image.find({
      searchQuery: { $regex: searchQuery, $options: "i" },
    }).populate("author", "username img_profile");
    // res.json(images)
    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("search", {
        searchQuery: searchQuery,
        imageList: images,
        page_name: "home",
        logged: true,
        User: User,
      });
    } else {
      res.render("search", {
        searchQuery: searchQuery,
        imageList: images,
        page_name: "home",
        logged: false,
        User: {},
      });
    }
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/popular", auth.checkAuthNext, async (req, res) => {
  try {
    const imageLists = await Image.find()
      .populate("author", "username img_profile")
      .sort({ views: -1 });
    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("popular", {
        imageList: imageLists,
        page_name: "popular",
        logged: true,
        User: User,
      });
    } else {
      res.render("popular", {
        imageList: imageLists,
        page_name: "popular",
        logged: false,
        User: {},
      });
    }
  } catch (error) {
    res.json({ error: error.message });
    // res.redirect("/404");
  }
});

module.exports = router;
