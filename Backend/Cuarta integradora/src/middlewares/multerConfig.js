const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profile') {
      cb(null, path.join(__dirname, '../uploads/profiles'));
    } else if (file.fieldname === 'product') {
      cb(null, path.join(__dirname, '../uploads/products'));
    } else {
      cb(null, path.join(__dirname, '../uploads/documents'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;