import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllData(req, res) {
  try {
    const users = await prisma.user.findMany();
    const reviews = await prisma.review.findMany();
    const properties = await prisma.property.findMany();
    const hosts = await prisma.host.findMany();
    const bookings = await prisma.booking.findMany();
    const amenities = await prisma.amenity.findMany();

    res.status(200).json({
      users,
      reviews,
      properties,
      hosts,
      bookings,
      amenities,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
