import express from "express";
import {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/properties", getAllProperties);
router.post("/properties", authenticateToken, createProperty);
router.get("/properties/:id", getPropertyById);
router.put("/properties/:id", authenticateToken, updateProperty);
router.delete("/properties/:id", authenticateToken, deleteProperty);

export default router;
