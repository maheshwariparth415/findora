import mongoose from "mongoose";

// Connects to MongoDB using Mongoose. Kept isolated from server.js so the
// connection strategy (replica sets, Atlas, local, etc.) can change without
// touching the rest of the app.
export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in the environment");
    }
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] Connection failed: ${err.message}`);
    process.exit(1);
  }
};
