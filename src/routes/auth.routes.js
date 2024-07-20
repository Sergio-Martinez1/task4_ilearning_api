import { Router } from "express";
import {
  login,
  signUp,
  logout,
  verifyToken,
  verifyStatus,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/verify_status/:id", verifyStatus)

export default router;
