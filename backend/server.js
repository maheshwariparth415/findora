import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "findora-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB immediately for serverless / local
connectDB().catch((err) => console.error("[db] Init error:", err));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`[server] Findora API running on port ${PORT}`));
}

export default app;