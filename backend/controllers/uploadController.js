import asyncHandler from "express-async-handler";
import { cloudinaryEnabled } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!cloudinaryEnabled) {
    res.status(503);
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_* values to backend/.env.");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image file received.");
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "findora/items", resource_type: "image" },
      (error, uploaded) => (error ? reject(error) : resolve(uploaded))
    );
    stream.end(req.file.buffer);
  });

  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
});
