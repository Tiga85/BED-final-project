import express from "express";
import {
  getAllAmenities,
  createAmenity,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} from "../services/amenityService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/amenities", getAllAmenities);
router.post("/amenities", authenticateToken, createAmenity);
router.get("/amenities/:id", getAmenityById);
router.put("/amenities/:id", authenticateToken, updateAmenity);
router.delete("/amenities/:id", authenticateToken, deleteAmenity);

export default router;
