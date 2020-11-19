const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require("../models/user");

function checkAuthNext(req, res, next) {
  try {
    const token = req.headers.cookie.split("=")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.isAuthenticated = true;
    req.user = decoded;
    next();
  } catch (err) {
    req.isAuthenticated = false;
    next();
  }
}

function checkAuth(req, res, next) {
  try {
    const token = req.headers.cookie.split("=")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.json({error : err.message})
  }
}

function getUser(id) {
  try {
    User = user.findById(id);
    console.log(id);
    return User;
  } catch (error) {
    console.log("no user found");
    return {};
  }
}

module.exports.checkAuthNext = checkAuthNext;
module.exports.checkAuth = checkAuth;
module.exports.getUser = getUser;
