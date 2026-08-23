import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import Item from "../models/Item.js";

// GET /api/notifications
export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })
    .populate("relatedItem", "name type")
    .sort({ createdAt: -1 });

  res.json({ notifications });
});

// PATCH /api/notifications/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      read: true,
    },
    {
      new: true,
    }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found.");
  }

  res.json({ notification });
});

// POST /api/notifications/contact
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { itemId, message } = req.body;

  // Validate input
  if (!itemId || !message?.trim()) {
    res.status(400);
    throw new Error("Item ID and message are required.");
  }

  // Find the item
  const item = await Item.findById(itemId);

  if (!item) {
    res.status(404);
    throw new Error("Item not found.");
  }

  // Prevent contacting yourself
  if (item.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot contact yourself about your own item.");
  }

  // Create notification for item owner
  const notification = await Notification.create({
    user: item.owner,
    type: "contact_message",
    title: `New message about ${item.name}`,
    message: message.trim(),
    relatedItem: item._id,
  });

  res.status(201).json({
    message: "Message sent successfully.",
    notification,
  });
});