import asyncHandler from "express-async-handler";
import Match from "../models/Match.js";

export const myMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find()
    .populate("lostItem foundItem")
    .sort({ createdAt: -1 });
  const mine = matches.filter(
    (m) => m.lostItem?.owner?.toString() === req.user._id.toString() ||
           m.foundItem?.owner?.toString() === req.user._id.toString()
  );
  res.json({ matches: mine });
});

export const getMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id).populate("lostItem foundItem");
  if (!match) { res.status(404); throw new Error("Match not found."); }
  const owns = [match.lostItem?.owner, match.foundItem?.owner].some(
    (id) => id?.toString() === req.user._id.toString()
  );
  if (!owns && req.user.role !== "admin") { res.status(403); throw new Error("Not authorized."); }
  res.json({ match });
});

export const matchesForItem = asyncHandler(async (req, res) => {
  const matches = await Match.find({
    $or: [{ lostItem: req.params.itemId }, { foundItem: req.params.itemId }],
  }).populate("lostItem foundItem").sort({ "scores.overall": -1 });
  res.json({ matches });
});
