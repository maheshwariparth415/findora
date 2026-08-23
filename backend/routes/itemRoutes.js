import express from "express";
import { listItems, getItem, createItem, myItems } from "../controllers/itemController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", listItems);
router.get("/mine", protect, myItems);
router.get("/:id", getItem);
router.post("/", protect, createItem);
export default router;
