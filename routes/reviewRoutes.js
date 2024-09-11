import express from "express";
import {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";

import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/reviews", getAllReviews);
router.post("/reviews", authMiddleware, createReview);
router.get("/reviews/:id", authMiddleware, getReviewById);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", authMiddleware, deleteReview);

export default router;
