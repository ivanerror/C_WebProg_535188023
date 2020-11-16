const express = require('express')
const router = express.Router()

router.get('/category', (req, res) => {
    res.render('category')
})

router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router