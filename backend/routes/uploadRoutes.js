// backend/routes/uploadRoutes.js

const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
  cb(null, path.join(__dirname, '../../uploads'));// Files saved in uploads folder
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  res.status(200).json({
    image: `/uploads/${req.file.filename}`,
  });
});


module.exports = router;
