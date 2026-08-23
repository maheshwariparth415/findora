import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    result: {
      type: String,
      enum: ["pending", "verified", "failed", "escalated"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);
