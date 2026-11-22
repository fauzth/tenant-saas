import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { ROLES } from "../constants/roles.js";
import {
  getTenant,
  listUser,
  createUser,
} from "../controllers/tenant.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getTenant);
router.get("/users", listUser);
router.post("/users", authorize(ROLES.OWNER, ROLES.PM), createUser);

export default router;
