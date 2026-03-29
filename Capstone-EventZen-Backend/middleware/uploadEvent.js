const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/events directory exists
const eventsDir = path.join(__dirname, "..", "uploads", "events");
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

const { storage } = require("../config/cloudinaryConfig");


const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage") {
    const allowedImg = /jpeg|jpg|png|gif|webp/;
    const valid =
      allowedImg.test(path.extname(file.originalname).toLowerCase()) &&
      allowedImg.test(file.mimetype);
    if (valid) return cb(null, true);
    return cb(new Error("Cover image must be jpeg, jpg, png, gif, or webp."));
  }

  if (file.fieldname === "promoVideo") {
    const allowedVid = /mp4|webm|ogg|mov|avi/;
    const mimeVid = /video\//;
    const extValid = allowedVid.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = mimeVid.test(file.mimetype);
    if (extValid && mimeValid) return cb(null, true);
    return cb(new Error("Promo video must be mp4, webm, ogg, mov, or avi."));
  }

  cb(null, true);
};

const uploadEvent = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB (for videos)
});

module.exports = uploadEvent;
