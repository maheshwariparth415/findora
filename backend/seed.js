import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.js";
import Item from "./models/Item.js";
import { connectDB } from "./config/db.js";

const run = async () => {
  await connectDB();
  await User.deleteMany({ email: { $in: ["admin@findora.app", "demo@findora.app"] } });

  const admin = await User.create({ name: "Findora Admin", email: "admin@findora.app", password: "Admin@12345", role: "admin" });
  const user = await User.create({ name: "Demo User", email: "demo@findora.app", password: "Demo@12345", role: "user" });

  await Item.deleteMany({ owner: { $in: [admin._id, user._id] } });

  await Item.create([
    {
      owner: user._id, type: "lost", name: "Black AirPods Case", category: "Electronics",
      description: "Matte black AirPods Pro case with a tiny scratch near the hinge.",
      location: { address: "Sector 17 Plaza, Chandigarh", area: "Sector 17", lat: 30.7415, lng: 76.7855 },
      occurredAt: new Date(), verification: { question: "Unique mark or scratch", answer: "tiny scratch near hinge" }
    },
    {
      owner: admin._id, type: "found", name: "Black AirPods Case", category: "Electronics",
      description: "Black AirPods case found near a bench. Small scratch around the hinge.",
      location: { address: "Sector 17 Plaza, Chandigarh", area: "Sector 17", lat: 30.7420, lng: 76.7850 },
      occurredAt: new Date()
    }
  ]);

  console.log("Seed complete.");
  console.log("User: demo@findora.app / Demo@12345");
  console.log("Admin: admin@findora.app / Admin@12345");
  await mongoose.connection.close();
};

run().catch(async (err) => { console.error(err); await mongoose.connection.close(); process.exit(1); });
