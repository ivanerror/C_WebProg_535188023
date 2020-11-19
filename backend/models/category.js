const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category : {
        type : String,
        required : true,
    },
    images: [],
    description: {
        type : String,
        required : true
    },
    image_url : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('categories', categorySchema);