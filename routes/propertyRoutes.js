import express from "express";
import {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";

import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/properties", getAllProperties);
router.post("/properties", authMiddleware, createProperty);
router.get("/properties/:id", getPropertyById);
router.put("/properties/:id", authMiddleware, updateProperty);
router.delete("/properties/:id", authMiddleware, deleteProperty);

export default router;
