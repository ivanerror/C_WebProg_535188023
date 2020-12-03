const express = require("express");
const request = require("request");
const cloudinary = require("../cloudinaryConfig");
const upload = require("../multerConfig");
const router = express.Router();
const Image = require("../models/image");
const Category = require("../models/category");
const auth = require("./auth");
const user = require("../models/user");
const imageAndUser = require("../models/imageAndUser");
const { Mongoose } = require("mongoose");
const multer = require("multer");
const { route } = require("./insframeAPI");

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
    photoData = await Image.findOne({ _id: photoName });
    data = await user.findOne({
      _id: {
        $in: photoData.author,
      },
    });
    console.log(data.username)
  } catch (error) {
    //res.redirect("/404");
    res.json(error);
  }
  if (req.isAuthenticated) {
    User = await auth.getUser(req.user.id);
    res.render("pop-up", {
      photoSelect: photoData,
      uploader: data,
      logged: true,
      User: User,
    });
  } else {
    res.render("pop-up", {
      photoSelect: photoData,
      uploader: data,
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
const multerConf = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/uploads')
    },
    filename: function (req, file, cb) {
      const parts = file.mimetype.split("/")[1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + parts);
    },
    fileFilter: function (req, file, next) {
      if (!file) {
        cb();
      }
      const image = file.mimetype.startsWith('image/')
      if (image) {
        cb({ message: "File Done" }, true);
      } else {
        cb({ message: "File type not supported" }, false)
      }
    }
  }),
};

router.get("/upload", auth.checkAuthNext, async (req, res) => {
  try {
    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("upload-form", {
        logged: true,
        User: User,
      });
    } else {
      res.redirect("/404");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post('/upload-image', multer(multerConf).single('photo'), async (req, res) => {
  if (req.file) {
    req.body.photo = req.file.filename;
    // cloudinary.uploader.upload("./public/img/uploads/" + req.file.filename,
    //   function (error, result) {
    //     this.result = result
    //     res.json(result)
    //   });
    const result = await cloudinary.uploader.upload("./public/img/uploads/" + req.file.filename)
    req.session.url = result.url
    res.redirect("/form-upload");
    console.log(req.session.url)
    //oper param done

  }
});

router.get("/form-upload", auth.checkAuthNext, async (req, res) => {
  categoryData = await Category.find();
  try {
    if (req.isAuthenticated) {
      User = await auth.getUser(req.user.id);
      res.render("upload-form-image", {
        categoryLists: categoryData,
        uploadImage: req.session.url,
        logged: true,
        User: User,
      });
      console.log(req.session.url)
      req.session.destroy();
    } else {
      res.redirect("/404");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/confirm-upload", auth.checkAuthNext, async (req, res) => {

  try {
    if (req.isAuthenticated) {
      const data = req.body;
      const authorId = req.user.id;
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
        author: req.user.id,
        searchQuery: searchQuery,
        views: 0,
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
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.redirect("/");
})


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
    const searchQuery = req.query.keyword
    const images = await Image.find({ searchQuery: { $regex: searchQuery, $options: 'i' } }).populate(
      "author",
      "username img_profile"
    );
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
    const imageLists = await Image.find().populate(
      "author",
      "username img_profile"
    ).sort({ views: -1 });
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
  }
  catch (error) {
    res.json({ error: error.message });
    // res.redirect("/404");
  }

});

module.exports = router;
