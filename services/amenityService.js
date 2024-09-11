import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllAmenities(req, res) {
  try {
    const { name } = req.query;

    const filter = {};
    if (name) {
      filter.name = { contains: name, mode: "insensitive" }; // Case-insensitive search
    }

    // Find amenities with matching properties
    const amenities = await prisma.amenity.findMany({
      where: filter,
      include: {
        properties: {
          include: {
            amenities: true, // Include the amenities within the properties
          },
        },
      },
    });

    res.status(200).json(amenities);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createAmenity(req, res) {
  try {
    const amenity = await prisma.amenity.create({
      data: req.body,
    });
    res.status(201).json(amenity);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

export async function getAmenityById(req, res) {
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
      },
    });
    if (!amenity) return res.status(404).json({ error: "Amenity not found" });
    res.status(200).json(amenity);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAmenity(req, res) {
  try {
    const amenity = await prisma.amenity.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(amenity);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

export async function deleteAmenity(req, res) {
  try {
    await prisma.amenity.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Amenity deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
