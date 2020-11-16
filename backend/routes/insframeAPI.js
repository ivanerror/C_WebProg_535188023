const express = require('express')
const router = express.Router()
const Image = require('../models/image')

//GET all images

router.get('/', async (req, res) => {
    try {
        const imageLists = await Image.find()
        if(!imageLists) throw new Error('No Image Lists')
        res.status(200).json(imageLists); 
    } catch (error) {
        res.status(500).json({message : error.message})        
    }
})

// Upload new Image

router.post('/', async (req, res) => {
    const newImageLists = new Image(req.body)
    try {
        const imageLists = await newImageLists.save()
        if (!imageLists) throw new Error('Something went wrong')
        res.status(200).json(imageLists)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Delete Image by ID

router.delete('/:id', async (req, res) => {
    const id = req.params
    try {
        const removed = await Image.findByIdAndDelete(id)
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})


module.exports = router