import express from "express";
import {
  getAllAmenities,
  createAmenity,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} from "../services/amenityService.js";
import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/amenities", getAllAmenities);
router.post("/amenities", authMiddleware, createAmenity);
router.get("/amenities/:id", getAmenityById);
router.put("/amenities/:id", authMiddleware, updateAmenity);
router.delete("/amenities/:id", authMiddleware, deleteAmenity);

export default router;
