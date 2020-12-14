const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: "insframe", 
    api_key: 213183559257757, 
    api_secret: "14QilzdvU_NovTjsjWYfNmBiN9U"
});

module.exports = cloudinary;