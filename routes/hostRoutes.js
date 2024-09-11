import express from "express";
import {
  getAllHosts,
  createHost,
  getHostById,
  updateHost,
  deleteHost,
} from "../services/hostService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/hosts",  getAllHosts);
router.post("/hosts", authenticateToken, createHost);
router.get("/hosts/:id", getHostById);
router.put("/hosts/:id", authenticateToken, updateHost);
router.delete("/hosts/:id", authenticateToken, deleteHost);

export default router;
