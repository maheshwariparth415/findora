import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

router.post("/image", protect, upload.single("image"), uploadImage);
export default router;
