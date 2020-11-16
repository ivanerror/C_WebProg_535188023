const express = require('express')
const router = express.Router()
const Image = require('../models/image')

router.get('/category', (req, res) => {
    res.render('category')
})

router.get("/", async(req, res) => {
    const images = await Image.find();
    console.log({images});
    res.render("index",  {imageList : images} );
});

module.exports = router