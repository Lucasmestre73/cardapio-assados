const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Arquivo precisa ser uma imagem'));
    cb(null, true);
  }
});

module.exports = (req, res, next) => {
  upload.single('imagem')(req, res, (error) => {
    if (error) {
      req.flash('errors', error.message);
      return res.redirect(req.originalUrl);
    }

    return next();
  });
};
