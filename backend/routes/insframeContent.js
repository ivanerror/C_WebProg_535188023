const express = require("express");
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");

router.get("/leaderboard", auth.checkAuthNext, async (req, res) => {
  
  var User = {};

  try {
    User = await user.findOne();
    res.render("leaderboard", {  User: User,page_name: "leaderboard",logged : false, });
  } catch (error) {
    res.redirect("/404");
  }
});

router.get("/category", auth.checkAuthNext, async (req, res) => {
  const categoryList = await Category.find();

  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id)
    console.log(req.user.id)
    res.render("category", {
      categoryLists: categoryList,
      page_name: "category",
      logged : true,
      User : User
    });
  } else {
    res.render("category", {
      categoryLists: categoryList,
      page_name: "category",
      logged : false,
      User : {}
    });
  }
});

router.get("/", auth.checkAuthNext ,async (req, res) => {
  const images = await Image.find();
  const categories = await Category.find().limit(6);
  if(req.isAuthenticated) {
    User = await auth.getUser(req.user.id)
    res.render("index", {
      imageList: images,
      categories: categories,
      navbarMode: "home",
      page_name: "home",
      logged : true,
      User : User
    });
  }else {
    res.render("index", {
      imageList: images,
      categories: categories,
      navbarMode: "home",
      page_name: "home",
      logged : false,
      User : {}
    });
  }
});

router.get("*" ,async (req, res) => {
  res.render('404', {layout : false})
});

router.get('/auth/berita', (req,res) => {
  res.render('index')
})

router.get("/form-data", async (req, res) => {
  const categoryList = await Category.find();
  res.render("upload-form", { categoryLists: categoryList });
});

// JSON UPLOADER
// untuk upload upload gambar

router.post("/form-data", async (req, res) => {
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



module.exports = router;
