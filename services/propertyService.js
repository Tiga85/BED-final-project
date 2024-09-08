import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllProperties(req, res) {
  try {
    const properties = await prisma.property.findMany();
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
