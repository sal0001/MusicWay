const multer = require("multer");
const fs = require("fs");
const path = require("path");

const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const musicDirectory = path.join(__dirname, "../public/musicas");
    if (!fs.existsSync(musicDirectory)) {
      fs.mkdirSync(musicDirectory, { recursive: true });
    }
    cb(null, musicDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagensDirectory = path.join(__dirname, "../public/imagens");
    if (!fs.existsSync(imagensDirectory)) {
      fs.mkdirSync(imagensDirectory, { recursive: true });
    }
    cb(null, imagensDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const uploadMusic = multer({ storage: musicStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { uploadMusic, uploadImage };