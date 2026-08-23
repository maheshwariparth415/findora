import express from "express";

import {
  listNotifications,
  markRead,
  sendContactMessage,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get user's notifications
router.get("/", protect, listNotifications);

// Send message to item owner/finder
router.post("/contact", protect, sendContactMessage);

// Mark notification as read
router.patch("/:id/read", protect, markRead);

export default router;