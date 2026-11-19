import express from "express";
import {
  registerTenant,
  login,
  profile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Endpoint: POST /api/v1/auth/register
router.post("/register", registerTenant);

router.post("/login", login);
router.get("/profile", authenticate, profile);

export default router;
