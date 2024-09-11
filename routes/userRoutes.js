import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/userService.js";

import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", authMiddleware, createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
