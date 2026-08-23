import asyncHandler from "express-async-handler";
import Claim from "../models/Claim.js";
import Match from "../models/Match.js";
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";

export const submitClaim = asyncHandler(async (req, res) => {
  const { matchId, answers } = req.body;
  const match = await Match.findById(matchId).populate("lostItem foundItem");
  if (!match) { res.status(404); throw new Error("Match not found."); }

  const claimantOwnsLost = match.lostItem.owner.toString() === req.user._id.toString();
  if (!claimantOwnsLost) {
    res.status(403); throw new Error("Only the reported owner of the lost item can submit this claim.");
  }

  const lost = await Item.findById(match.lostItem._id).select("+verification.answer");
  const expected = lost.verification?.answer?.trim().toLowerCase();
  const provided = (answers || []).map((a) => a?.answer?.trim().toLowerCase()).filter(Boolean);
  const isCorrect = Boolean(expected && provided.includes(expected));

  const claim = await Claim.create({
    match: match._id,
    claimant: req.user._id,
    answers,
    result: isCorrect ? "verified" : "failed",
  });

  match.status = isCorrect ? "verified" : "claimed";
  await match.save();

  await Item.updateMany(
    { _id: { $in: [match.lostItem._id, match.foundItem._id] } },
    { status: isCorrect ? "verified" : "claim_pending" }
  );

  await Notification.create({
    user: match.foundItem.owner,
    type: isCorrect ? "claim_verified" : "claim_submitted",
    title: isCorrect ? "Claim verified" : "Claim submitted",
    message: isCorrect
      ? `The ownership claim for "${match.foundItem.name}" has been verified.`
      : `Someone submitted an ownership claim for the "${match.foundItem.name}" you found.`,
    relatedItem: match.foundItem._id,
  });

  res.status(201).json({ claim });
});

export const escalateClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate("match");
  if (!claim) { res.status(404); throw new Error("Claim not found."); }
  if (claim.claimant.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized.");
  }
  claim.result = "escalated";
  await claim.save();
  res.json({ claim });
});
