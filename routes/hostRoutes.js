import express from "express";
import {
  getAllHosts,
  createHost,
  getHostById,
  updateHost,
  deleteHost,
} from "../services/hostService.js";

import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/hosts", getAllHosts);
router.post("/hosts", authMiddleware, createHost);
router.get("/hosts/:id", getHostById);
router.put("/hosts/:id", authMiddleware, updateHost);
router.delete("/hosts/:id", authMiddleware, deleteHost);

export default router;
