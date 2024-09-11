import express from "express";
import {
  getAllBookings,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../services/bookingService.js";

import {authMiddleware} from '../middleware/advancedAuth.js';
//import {authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/bookings", getAllBookings);
router.post("/bookings", authMiddleware, createBooking);
router.get("/bookings/:id", getBookingById);
router.put("/bookings/:id", authMiddleware, updateBooking);
router.delete("/bookings/:id", authMiddleware, deleteBooking);

export default router;
