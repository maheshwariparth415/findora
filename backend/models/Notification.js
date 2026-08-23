import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
  "match_found",
  "claim_submitted",
  "claim_verified",
  "claim_failed",
  "contact_message",
  "system",
],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
