import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all properties with query parameters
export async function getAllProperties(req, res) {
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

    // Build filter object dynamically based on query parameters
    const filter = {};

    if (hostId) filter.hostId = hostId;
    if (title) filter.title = { contains: title, mode: "insensitive" }; // Case-insensitive search
    if (location) filter.location = { contains: location, mode: "insensitive" }; // Case-insensitive search
    if (pricePerNight) filter.pricePerNight = parseFloat(pricePerNight);
    if (bedroomCount) filter.bedroomCount = parseInt(bedroomCount);
    if (bathRoomCount) filter.bathRoomCount = parseInt(bathRoomCount);
    if (maxGuestCount) filter.maxGuestCount = parseInt(maxGuestCount);

    // Filtering by amenities if provided (assuming amenities are stored as a related model)
    if (amenities) {
      filter.amenities = {
        some: {
          name: amenities, // You can also use { contains: amenities } if partial match is needed
        },
      };
    }

    // Filter based on bookings or reviews count if needed
    if (bookings) {
      filter.bookings = {
        some: {}, // Define how you want to filter based on bookings (e.g., count, property ID, etc.)
      };
    }

    if (reviews) {
      filter.reviews = {
        some: {}, // Define how you want to filter based on reviews
      };
    }

    // Filter properties by host details if `host` parameter is provided
    if (host) {
      filter.host = {
        name: { contains: host, mode: "insensitive" }, // Assuming host is related via a 'name' field
      };
    }

    // Fetch properties with filters and include related data
    const properties = await prisma.property.findMany({
      where: filter,
      include: {
        amenities: true,
        bookings: true, // Include bookings if needed
        reviews: true, // Include reviews if needed
        host: true, // Include host details if needed
      },
    });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createProperty(req, res) {
  try {
    const property = await prisma.property.create({
      data: req.body,
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

export async function getPropertyById(req, res) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProperty(req, res) {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

export async function deleteProperty(req, res) {
  try {
    await prisma.booking.updateMany({
      where: { propertyId: req.params.id },
      data: { propertyId: null },
    });
    await prisma.property.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
