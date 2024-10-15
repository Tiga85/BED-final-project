import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js";

const prisma = new PrismaClient();

export async function getAllAmenities(req, res, next) {
  try {
    const { name } = req.query;
    console.log("Query name parameter:", name); // Add logging to debug

    let amenities;
    if (name) {
      amenities = await prisma.amenity.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive", // Case-insensitive search
          },
        },
        include: { properties: true },
      });
      if (!amenities) {
        throw new NotFoundError("Amenity not found", name);
      }
      res.status(200).json(amenities);
    } else {
      amenities = await prisma.amenity.findMany();
      res.status(200).json(amenities);
    }
  } catch (error) {
    next(error);
  }
}

export async function createAmenity(req, res, next) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const amenity = await prisma.amenity.create({
      data: req.body,
    });

    res.status(201).json(amenity);
  } catch (error) {
    next(error);
  }
}

export async function getAmenityById(req, res, next) {
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
      },
    });

    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
}

export async function updateAmenity(req, res, next) {
  try {
    // Check if the amenity exists
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
    });

    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    // Update the amenity
    const updatedAmenity = await prisma.amenity.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(updatedAmenity);
  } catch (error) {
    next(error);
  }
}

export async function deleteAmenity(req, res, next) {
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
    });

    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    await prisma.amenity.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Amenity deleted" });
  } catch (error) {
    next(error);
  }
}
