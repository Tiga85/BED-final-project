import express from "express";
import {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reviews",  getAllReviews);
router.post("/reviews", authenticateToken, createReview);
router.get("/reviews/:id",  getReviewById);
router.put("/reviews/:id", authenticateToken, updateReview);
router.delete("/reviews/:id", authenticateToken, deleteReview);

export default router;
