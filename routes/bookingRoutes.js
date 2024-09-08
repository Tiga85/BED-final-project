import express from "express";
import {
  getAllBookings,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../services/bookingService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookings",  getAllBookings);
router.post("/bookings", authenticateToken, createBooking);
router.get("/bookings/:id",  getBookingById);
router.put("/bookings/:id", authenticateToken, updateBooking);
router.delete("/bookings/:id", authenticateToken, deleteBooking);

export default router;
