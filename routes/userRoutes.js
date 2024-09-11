import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/userService.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users",  getAllUsers);
router.post("/users", authenticateToken, createUser);
router.get("/users/:id",  getUserById);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

export default router;
