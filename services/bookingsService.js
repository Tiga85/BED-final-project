import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js";

const prisma = new PrismaClient();

export async function getAllBookings(req, res, next) {
  try {
    const { userId, propertyId } = req.query; // Extract query parameters

    // Initialize the "where" clause object
    const whereClause = {};

    // If userId is provided, add it to the "where" clause
    if (userId) {
      whereClause.userId = userId;
    }

    // If propertyId is provided, add it to the "where" clause
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }

    // Query the bookings based on the "where" clause
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            // Password is intentionally excluded
          },
        }, // Include user related to the booking
        property: true, // Include property related to the booking
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

export async function createBooking(req, res, next) {
  try {
    const booking = await prisma.booking.create({
      data: req.body,
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            // Password is intentionally excluded
          },
        }, // Include user related to the booking
        property: true, // Include property related to the booking
      },
    });
    if (!booking) {
      throw new NotFoundError("booking", req.params.id);
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req, res, next) {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function deleteBooking(req, res, next) {
  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: req.params.id },
    });
    if (!deletedBooking) {
      throw new NotFoundError("booking", req.params.id);
    }
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    next(error);
  }
}
