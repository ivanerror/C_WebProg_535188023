const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const imageAndUser = require("../models/imageAndUser");

router.get("/leaderboard", auth.checkAuthNext, async (req, res) => {

  try {
    User = await user.find();
    res.render("leaderboard", {  User: User,page_name: "leaderboard",logged : false, });
  } catch (error) {
    res.redirect("/404");
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
    photoData = await Image.findOne({ photo: photoName });
  } catch (error) {
    res.redirect("/404");
  }
  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id);
    res.render("pop-up", {
      photoSelect: photoData,
      logged: true,
      User: User,
    });
  } else {
    res.render("pop-up", {
      photoSelect: photoData,
      logged: false,
      User: {},
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

router.get("/form-data", async (req, res) => {
  const data = req.body;
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


router.get("/search/:searchQuery", auth.checkAuthNext ,async (req,res) => {
  try {
    const images = await Image.find().populate(
      "author",
      "username img_profile"
    );
    const categories = await Category.find().limit(6);

    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("search", {
        searchQuery : req.params.searchQuery,
        imageList: images,
        page_name: "home",
        logged: true,
        User: User,
      });
    } else {
      res.render("search", {
        searchQuery : req.params.searchQuery,
        imageList: images,
        page_name: "home",
        logged: false,
        User: {},
      });
    }
  } catch (error) {
    res.redirect("/404");
  }
})


router.get("/popular", auth.checkAuthNext, async(req, res) =>{
  const images = await Image.find().populate("author","username img_profile")
  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id);
    res.render("popular", {
      imageList: images,
      page_name:"popular",
      logged: true,
      User: User
    });
    } else {
    res.render("popular", {
      imageList: images,
      page_name:"popular",
      logged: false,
      User: {}
    });
  }
})

module.exports = router;
