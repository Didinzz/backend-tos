const multer = require("multer")

const errorHandler = (err, req, res, next) => {
  if(err instanceof multer.MulterError) {

    if(err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ code: 400, status: "bad request", message: "File terlalu besar! Maksimal ukuran file 10MB" });
    }

    return res.status(400).json({ message: err.message });
  }else if(err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

module.exports = errorHandler