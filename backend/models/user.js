const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true,
    },
    img_profile : String,
    email : {
        type : String,
        required : true,
        unique : true
    },
    biography : String,
    location : String,
    website : String
})

module.exports = mongoose.model('users', userSchema);