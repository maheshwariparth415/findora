import mongoose from "mongoose";

// A single model represents both "lost" and "found" reports, distinguished
// by `type`. This keeps matching logic (which compares across the two)
// simple, since both sides share one schema and one collection.
const itemSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Bags", "Documents", "Jewelry", "Keys", "Wallets", "Apparel", "Other"],
    },
    description: { type: String, required: true },
    images: [{ type: String }],
   location: {
      type: String,
      required: [true, 'Please provide the specific location or landmark'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide the city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide the state'],
      trim: true,
    },
    occurredAt: { type: Date, required: true },
    // Only present on "lost" reports. Never returned by public-facing routes.
    verification: {
      question: { type: String },
      answer: { type: String, select: false },
    },
    status: {
      type: String,
      enum: ["searching", "match_found", "claim_pending", "verified", "recovered", "closed"],
      default: "searching",
    },
  },
  { timestamps: true }
);

itemSchema.index({ "location.lat": 1, "location.lng": 1 });
itemSchema.index({ category: 1, type: 1 });

export default mongoose.model("Item", itemSchema);
