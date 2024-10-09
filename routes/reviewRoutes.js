import express from "express";
import {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/reviewsService.js";

//import {authMiddleware} from '../middleware/advancedAuth.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get("/", getAllReviews);
router.post("/", authMiddleware, createReview);
router.get("/:id", getReviewById);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
