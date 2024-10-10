import express from "express";
import {
  getAllAmenities,
  createAmenity,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} from "../services/amenityService.js";
//import {authMiddleware} from '../middleware/advancedAuth.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get("/", getAllAmenities);
router.post("", authMiddleware, createAmenity);
router.get("/:id", getAmenityById);
router.put("/:id", authMiddleware, updateAmenity);
router.delete("/:id", authMiddleware, deleteAmenity);
