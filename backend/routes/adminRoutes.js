import express from "express";
import {
  overview,
  listClaims,
  resolveClaim,
  suspendUser,
  removeItem,
} from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, requireAdmin);

router.get("/overview", overview);
router.get("/claims", listClaims);
router.patch("/claims/:id", resolveClaim);
router.patch("/users/:id/suspend", suspendUser);
router.delete("/items/:id", removeItem);

export default router;
