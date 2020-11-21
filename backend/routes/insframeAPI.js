const express = require("express");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//GET all images

router.get("/", async (req, res) => {
  try {
    const imageLists = await Image.find();
    if (!imageLists) throw new Error("No Image Lists");
    res.status(200).json(imageLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new Image

router.post("/", async (req, res) => {
  const newImageLists = new Image(req.body);
  try {
    const imageLists = await newImageLists.save();
    if (!imageLists) throw new Error("Something went wrong");
    res.status(200).json(imageLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Image by ID

router.delete("/:id", async (req, res) => {
  const id = req.params;
  try {
    const removed = await Image.findByIdAndDelete(id);
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new Category

router.post("/photo", async (req, res) => {
  const newImages = new Image(req.body);
  try {
    const imagesLists = await newImages.save();
    if (!imagesLists) throw new Error("Something went wrong");
    res.status(200).json(imagesLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Category List
router.get("/category", async (req, res) => {
  try {
    const categoryLists = await Category.find();
    if (!categoryLists) throw new Error("No Category Lists");
    res.status(200).json(categoryLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User List

router.get("/user", async (req, res) => {
  try {
    const userLists = await User.find();
    if (!userLists) throw new Error("No User Lists");
    res.status(200).json(userLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user", async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const newUser = new User(req.body);
  try {
    const userLists = await newUser.save();
    if (!userLists) throw new Error("Something went wrong");
    res.status(200).json(userLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/is", async (req, res) => {
<<<<<<< HEAD
=======
  console.log("omg");
>>>>>>> 02d28cfcd55e122353f17c9bc010a3df993da106

  try {
    const imageSync = await Image.find().populate("author","username email biography")
    res.status(200).json(imageSync)
  } catch (error) {
    console.log(error.message);
  }
});

// collected by 

router.get("/iscollect", async (req, res) => {
  console.log("omg");
  try {
    const imageSync = await Image.find({collect_by : "5fb3d310e9cc3529ec25f3b7"}).populate("author","username email biography")
    res.status(200).json(imageSync)
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
