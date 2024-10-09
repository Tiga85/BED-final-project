import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/usersService.js";

//import {authMiddleware} from '../middleware/advancedAuth.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

export const router = express.Router();

router.get("/", getAllUsers);
router.post("/", authMiddleware, createUser);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

