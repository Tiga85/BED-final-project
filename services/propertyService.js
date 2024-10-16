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
    const includeRelatedData =
      hostId ||
      title ||
      location ||
      pricePerNight ||
      amenities ||
      bedroomCount ||
      bathRoomCount ||
      maxGuestCount;

    const properties = await prisma.property.findMany({
      where: filter,
      include: includeRelatedData
        ? {
            // Include related data only if filters are applied
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
      return res.status(400).json({
        error: "Title, description, location, and pricePerNight are required",
      });
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
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const propertyWithDetails = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        amenities: true,
        bookings: true,
        reviews: true,
        host: true,
      },
    });

    if (!propertyWithDetails) {
      // Unexpected case where property exists but related data fails to load
      return res.status(500).json({ error: "Failed to load related data" });
    }

    if (!propertyWithDetails.amenities) {
      return res.status(404).json({ error: "Amenities not found" });
    }

    if (!propertyWithDetails.bookings) {
      return res.status(404).json({ error: "Bookings not found" });
    }

    if (!propertyWithDetails.reviews) {
      return res.status(404).json({ error: "Reviews not found" });
    }

    if (!propertyWithDetails.host) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(200).json(propertyWithDetails);
  } catch (error) {
    console.error("Error retrieving property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProperty(req, res, next) {
  try {
    // Check if the property exists
    const propertyExists = await prisma.property.findUnique({
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

    if (!updatedProperty.amenities) {
      return res.status(404).json({ error: "Amenities not found" });
    }

    if (!updatedProperty.bookings) {
      return res.status(404).json({ error: "Bookings not found" });
    }

    if (!updatedProperty.reviews) {
      return res.status(404).json({ error: "Reviews not found" });
    }

    if (!updatedProperty.host) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export async function deleteProperty(req, res, next) {
  try {
    const propertyId = req.params.id; // Correctly retrieve propertyId from req.params

    // Add a console log to check the propertyId
    console.log(`Deleting property with ID: ${propertyId}`);

    if (!propertyId) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    // Check if the property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Set propertyId to null in related bookings and reviews
    await prisma.booking.updateMany({
      where: { propertyId },
      data: { propertyId: null },
    });

    await prisma.review.updateMany({
      where: { propertyId },
      data: { propertyId: null },
    });

    // Disconnect amenities
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        amenities: {
          set: [], // Disconnect all amenities
        },
      },
    });

    // Set hostId to null in the property
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        hostId: null,
      },
    });

    // Delete the property
    const deletedProperty = await prisma.property.delete({
      where: { id: propertyId },
    });

    console.log(`Deleted property:`, deletedProperty);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error); // Pass the error to the error handling middleware
  }
}
