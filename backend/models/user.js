const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    img_profile : String,
    Name : {
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
        required : true
    },
    biography : String,
    Location : String,
    Website : String
})

module.exports = mongoose.model('users', userSchema);