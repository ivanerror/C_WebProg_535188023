const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category : {
        type : String,
        required : true,
    },
    images: []
})

module.exports = mongoose.model('categories', categorySchema);