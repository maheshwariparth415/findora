import express from "express";
import { myMatches, getMatch, matchesForItem } from "../controllers/matchController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/mine", protect, myMatches);
router.get("/item/:itemId", protect, matchesForItem);
router.get("/:id", protect, getMatch);
export default router;
