import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all bookings
export async function getAllBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,   // Include user related to the booking
        property: true, // Include property related to the booking
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create a new booking
export async function createBooking(req, res) {
  try {
    const booking = await prisma.booking.create({
      data: req.body,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Get booking by ID
export async function getBookingById(req, res) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,   // Include user related to the booking
        property: true, // Include property related to the booking
      },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update booking by ID
export async function updateBooking(req, res) {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Delete booking by ID
export async function deleteBooking(req, res) {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
