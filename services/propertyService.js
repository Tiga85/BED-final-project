import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js";

const prisma = new PrismaClient();

// Get all properties with query parameters
export async function getAllProperties(req, res, next) {
  try {
    const {
      hostId,
      title,
      location,
      pricePerNight,
      amenities,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      bookings,
      reviews,
      host,
    } = req.query;

    // Build filter object based on query parameters
    const filter = {};

    if (hostId) filter.hostId = hostId;
    if (title) filter.title = { contains: title, mode: "insensitive" };
    if (location) filter.location = { contains: location, mode: "insensitive" };
    if (pricePerNight) filter.pricePerNight = parseFloat(pricePerNight);
    if (bedroomCount) filter.bedroomCount = parseInt(bedroomCount);
    if (bathRoomCount) filter.bathRoomCount = parseInt(bathRoomCount);
    if (maxGuestCount) filter.maxGuestCount = parseInt(maxGuestCount);

    if (amenities) {
      filter.amenities = {
        some: { name: amenities },
      };
    }

    if (bookings) {
      filter.bookings = { some: {} };
    }

    if (reviews) {
      filter.reviews = { some: {} };
    }

    if (host) {
      filter.host = { name: { contains: host, mode: "insensitive" } };
    }

    const properties = await prisma.property.findMany({
      where: filter,
      include: {
        amenities: true, // Include amenities related to the property
        bookings: true, // Include bookings related to the property
        reviews: true, // Include reviews related to the property
        host: true, // Include host related to the property
      },
    });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
}

export async function createProperty(req, res, next) {
  try {
    const property = await prisma.property.create({
      data: req.body,
    });
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
}

export async function getPropertyById(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });
    if (!property) {
      throw new NotFoundError("property", req.params.id);
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    await prisma.booking.updateMany({
      where: { propertyId: req.params.id },
      data: { propertyId: null }, // Set propertyId to null in related bookings
    });
    const deletedProperty = await prisma.property.delete({
      where: { id: req.params.id },
    });
    if (!deletedProperty) {
      throw new NotFoundError("property", req.params.id);
    }
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    next(error);
  }
}
