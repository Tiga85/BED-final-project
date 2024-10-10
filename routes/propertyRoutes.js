import express from "express";
import {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";

//import {authMiddleware} from '../middleware/advancedAuth.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

export const router = express.Router();

router.get("/", getAllProperties);
router.post("/", authMiddleware, createProperty);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);


