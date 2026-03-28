import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "ZYNC-Avatars",
      format: "png", // optional
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});


const upload = multer({ storage });

export default upload;
