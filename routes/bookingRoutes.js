import express from "express";
import {
  getAllBookings,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../services/bookingsService.js";

//import {authMiddleware} from '../middleware/advancedAuth.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get("/", getAllBookings);
router.post("/", authMiddleware, createBooking);
router.get("/:id", getBookingById);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);
