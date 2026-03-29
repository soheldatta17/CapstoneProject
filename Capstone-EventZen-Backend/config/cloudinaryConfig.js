const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "eventzen";
    let resource_type = "auto";
    
    if (file.fieldname === "promoVideo") {
      resource_type = "video";
      folder = "eventzen/videos";
    } else if (file.fieldname === "coverImage") {
      folder = "eventzen/covers";
    } else if (file.fieldname === "avatar") {
      folder = "eventzen/avatars";
    }

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

module.exports = { cloudinary, storage };
