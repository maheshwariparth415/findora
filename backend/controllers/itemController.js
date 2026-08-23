import asyncHandler from "express-async-handler";
import Item from "../models/Item.js";
import Match from "../models/Match.js";
import Notification from "../models/Notification.js";
import { computeMatch } from "../services/aiMatchingService.js";

export const listItems = asyncHandler(async (req, res) => {
  const { type, category, q, area, status } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (area) filter["location.area"] = area;
  if (status) filter.status = status;
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
  const items = await Item.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ items });
});

export const myItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

export const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).select("-verification.answer");
  if (!item) {
    res.status(404);
    throw new Error("Item not found.");
  }
  res.json({ item });
});

export const createItem = asyncHandler(async (req, res) => {
  const { type, name, category, description, images, location, occurredAt, verification } = req.body;
  if (!["lost", "found"].includes(type)) {
    res.status(400); throw new Error("Type must be lost or found.");
  }
  if (!name || !category || !description || !location?.address || location?.lat == null || location?.lng == null || !occurredAt) {
    res.status(400); throw new Error("Name, category, description, location and date are required.");
  }
  if (type === "lost" && (!verification?.question || !verification?.answer)) {
    res.status(400); throw new Error("Lost reports require a private verification question and answer.");
  }

  const item = await Item.create({
    owner: req.user._id, type, name, category, description,
    images: Array.isArray(images) ? images : [],
    location, occurredAt,
    verification: type === "lost" ? verification : undefined,
  });

  const statField = type === "lost" ? "stats.itemsLost" : "stats.itemsFound";
  await req.user.updateOne({ $inc: { [statField]: 1 } });

  await runMatchingPass(item);
  res.status(201).json({ item });
});

async function runMatchingPass(newItem) {
  const oppositeType = newItem.type === "lost" ? "found" : "lost";
  const candidates = await Item.find({ type: oppositeType, category: newItem.category, status: { $nin: ["recovered", "closed"] } }).limit(50);

  for (const candidate of candidates) {
    const lostItem = newItem.type === "lost" ? newItem : candidate;
    const foundItem = newItem.type === "found" ? newItem : candidate;
    const scores = await computeMatch(lostItem, foundItem);
    if (scores.overall < 60) continue;

    const match = await Match.findOneAndUpdate(
      { lostItem: lostItem._id, foundItem: foundItem._id },
      { scores, engine: "mock-v1" },
      { upsert: true, new: true }
    );

    await Item.updateMany({ _id: { $in: [lostItem._id, foundItem._id] } }, { status: "match_found" });

    const alreadyNotified = await Notification.exists({
      user: lostItem.owner, type: "match_found", relatedItem: foundItem._id,
    });
    if (!alreadyNotified) {
      await Notification.create({
        user: lostItem.owner, type: "match_found",
        title: "Potential match found",
        message: `Your lost "${lostItem.name}" may match a found item (${scores.overall}% match).`,
        relatedItem: foundItem._id,
      });
    }
    return match;
  }
}
