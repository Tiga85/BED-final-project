import express from "express";
import {
  getAllHosts,
  createHost,
  getHostById,
  updateHost,
  deleteHost,
} from "../services/hostsService.js";

//import {authMiddleware} from '../middleware/advancedAuth.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get("/", getAllHosts);
router.post("/", authMiddleware, createHost);
router.get("/:id", getHostById);
router.put("/:id", authMiddleware, updateHost);
router.delete("/:id", authMiddleware, deleteHost);
