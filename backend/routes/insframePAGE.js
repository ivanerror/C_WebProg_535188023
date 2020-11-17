const express = require("express");
const ExifImage = require("exif").ExifImage;
const request = require("request");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");

router.get("/sign/:mode", (req, res) => {
  let mode = "";
  if (req.params.mode == "in") {
    mode = "";
  } else if (req.params.mode == "up") {
    mode = "sign-up-mode";
  }
  res.render("login", { mode: mode });
});

router.get("/category", async (req, res) => {
  const categoryList = await Category.find();
  res.render("category", { categoryLists: categoryList });
});

router.get("", async (req, res) => {
  const images = await Image.find();
  res.render("index", { imageList: images });
});

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
