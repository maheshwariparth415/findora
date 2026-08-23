import express from "express";
import { submitClaim, escalateClaim } from "../controllers/claimController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/", protect, submitClaim);
router.post("/:id/escalate", protect, escalateClaim);

export default router;
