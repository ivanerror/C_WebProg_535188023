const express = require('express')
const router = express.Router()
const Image = require('../models/image')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/category', (req, res) => {
    res.render('category')
})

module.exports = router