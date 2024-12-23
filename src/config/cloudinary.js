require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dxeo1pqto',
    api_key: '837758914663983',
    api_secret: 'QEqXg8KD7a-CTqTRvfjHFYaYsmQ',
});

module.exports = cloudinary;