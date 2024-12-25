const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import konfigurasi Cloudinary

// Konfigurasi CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

// Filter File
const filterFile = (req, file, cb) => {
  const allowedFileType = /pdf|doc|docx|ppt|pptx/; // Ekstensi yang diizinkan
  const extname = allowedFileType.test(
    file.originalname.toLowerCase().split('.').pop()
  );

  if (extname) {
    return cb(null, true); // File diterima
  }

  // File ditolak
  cb(new Error('File harus berupa PDF, DOC, DOCX, PPT, atau PPTX'));
};


const upload = multer({ 
  storage: storage, 
  fileFilter: filterFile
});

module.exports = upload;
