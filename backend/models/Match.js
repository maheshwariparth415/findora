import mongoose from "mongoose";

// Stores the output of the AI matching service for a (lost, found) pair so
// scores don't need to be recomputed on every page view.
const matchSchema = new mongoose.Schema(
  {
    lostItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    foundItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    scores: {
      imageSimilarity: { type: Number, min: 0, max: 100 },
      descriptionSimilarity: { type: Number, min: 0, max: 100 },
      locationProximity: { type: Number, min: 0, max: 100 },
      overall: { type: Number, min: 0, max: 100 },
    },
    engine: { type: String, default: "mock-v1" },
    status: {
      type: String,
      enum: ["suggested", "claimed", "verified", "rejected"],
      default: "suggested",
    },
  },
  { timestamps: true }
);

matchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
