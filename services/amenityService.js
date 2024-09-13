import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js";

const prisma = new PrismaClient();

export async function getAllAmenities(req, res, next) {
  try {
    const { name } = req.query;

    const filter = {};
    if (name) {
      filter.name = { contains: name, mode: "insensitive" };
    }

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
    next(error);
  }
}

export async function createAmenity(req, res, next) {
  try {
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
        properties: true, // Include the properties associated with the amenity
      },
    });
    if (!amenity) {
      throw new NotFoundError("amenity", req.params.id);
    }
    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
}

export async function updateAmenity(req, res, next) {
  try {
    const amenity = await prisma.amenity.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(amenity);
  } catch (error) {
    next(error);
  }
}

export async function deleteAmenity(req, res, next) {
  try {
    const deletedAmenity = await prisma.amenity.delete({
      where: { id: req.params.id },
    });
    if (!deletedAmenity) {
      throw new NotFoundError("amenity", req.params.id);
    }
    res.status(200).json({ message: "Amenity deleted" });
  } catch (error) {
    next(error);
  }
}
