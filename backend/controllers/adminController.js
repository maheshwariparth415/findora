import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Item from "../models/Item.js";
import Claim from "../models/Claim.js";
import Notification from "../models/Notification.js";

export const overview = asyncHandler(async (req, res) => {
  const [totalUsers, lostItems, foundItems, recoveries, pendingClaims, disputedCases] = await Promise.all([
    User.countDocuments(), Item.countDocuments({ type: "lost" }), Item.countDocuments({ type: "found" }),
    Item.countDocuments({ status: "recovered" }), Claim.countDocuments({ result: "pending" }),
    Claim.countDocuments({ result: "escalated" }),
  ]);
  res.json({ totalUsers, lostItems, foundItems, recoveries, pendingClaims, disputedCases });
});

export const listClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find()
    .populate({ path: "match", populate: ["lostItem", "foundItem"] })
    .populate("claimant", "name email")
    .sort({ createdAt: -1 });
  res.json({ claims });
});

export const resolveClaim = asyncHandler(async (req, res) => {
  const { result, adminNote } = req.body;
  if (!["pending", "verified", "failed", "escalated"].includes(result)) {
    res.status(400); throw new Error("Invalid claim result.");
  }
  const claim = await Claim.findById(req.params.id).populate("match");
  if (!claim) { res.status(404); throw new Error("Claim not found."); }

  claim.result = result;
  claim.adminNote = adminNote || "";
  claim.reviewedBy = req.user._id;
  await claim.save();

  if (claim.match) {
    claim.match.status = result === "verified" ? "verified" : result === "failed" ? "rejected" : claim.match.status;
    await claim.match.save();
    if (result === "verified") {
      await Item.updateMany({ _id: { $in: [claim.match.lostItem, claim.match.foundItem] } }, { status: "verified" });
    }
  }

  await Notification.create({
    user: claim.claimant,
    type: result === "verified" ? "claim_verified" : result === "failed" ? "claim_failed" : "system",
    title: `Claim ${result}`,
    message: `Your ownership claim was marked ${result} by an administrator.${adminNote ? ` Note: ${adminNote}` : ""}`,
  });

  res.json({ claim });
});

export const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: "suspended" }, { new: true });
  if (!user) { res.status(404); throw new Error("User not found."); }
  res.json({ user });
});

export const removeItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404); throw new Error("Item not found."); }
  res.json({ message: "Report removed." });
});
