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
        some: { name: amenities }, // Filter properties that have the specified amenity
      };
    }

    // Determine if query parameters are provided
    const includeRelatedData = hostId || title || location || pricePerNight || amenities || bedroomCount || bathRoomCount || maxGuestCount;

    const properties = await prisma.property.findMany({
      where: filter,
      include: includeRelatedData
        ? { // Include related data only if filters are applied
            amenities: true,
            bookings: true,
            reviews: true,
            host: true,
          }
        : {}, // Exclude related data when no filters are applied
    });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
}

export async function createProperty(req, res, next) {
  try {
    const { title, description, location, pricePerNight } = req.body;

    // Check if required fields are provided
    if (!title || !description || !location || !pricePerNight) {
      return res.status(400).json({ error: 'Title, description, location, and pricePerNight are required' });
    }

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
    // Attempt to find the property by its ID and include related data
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        amenities: true,
        bookings: true,
        reviews: true,
        host: true,
      },
    });

    // Return 404 if the property is not found
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // If found, return the property with related data
    res.status(200).json(property);
  } catch (error) {
    console.error("Error retrieving property:", error);
    next(error); // Pass the error to the error handling middleware
  }
}





export async function updateProperty(req, res, next) {
  try {
    // Check if the property exists
    const propertyExists = await prisma.property.findFirst({
      where: { id: req.params.id },
    });

    // Return 404 if property not found
    if (!propertyExists) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Update the property if it exists
    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        amenities: true,
        bookings: true,
        reviews: true,
        host: true,
      },
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    next(error);
  }
}






export async function deleteProperty(req, res, next) {
  try {
    // Check if the property exists
    const propertyExists = await prisma.property.findFirst({
      where: { id: req.params.id },
    });

    // Return 404 if property not found
    if (!propertyExists) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Find related bookings and set propertyId to null before deleting the property
    await prisma.booking.updateMany({
      where: { propertyId: req.params.id },
      data: { propertyId: null },
    });

    // Delete the property
    await prisma.property.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);
    next(error);
  }
}
