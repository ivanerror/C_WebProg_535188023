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
    name : {
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        }
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    biography : String,
    Location : String,
    Website : String
})

module.exports = mongoose.model('users', userSchema);