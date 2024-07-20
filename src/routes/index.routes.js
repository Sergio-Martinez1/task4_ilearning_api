import { Router } from "express";
import {
  blockUser,
  deleteUser,
  getUsers,
  unblockUser,
} from "../controllers/index.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/get_users", authRequired, getUsers);
router.post("/block_user/:id", authRequired, blockUser);
router.post("/unblock_user/:id", authRequired, unblockUser);
router.delete("/delete_user/:id", authRequired, deleteUser);

export default router;
