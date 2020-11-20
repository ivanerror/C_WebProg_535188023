const mongoose = require("mongoose");

const imageAndUserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  detail: {
    description: String,
    raw: {
      megapixel: String,
      camera: String,
      iso: String,
      ss: String,
      aperture: String,
    },
  },
  author: {
    type: String,
    required: true,
  },
  liked_by: [],
  collect_by: [],
  views: "Number",
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("ImageAndUser", imageAndUserSchema);
