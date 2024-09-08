import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all hosts
export async function getAllHosts(req, res) {
  try {
    const hosts = await prisma.host.findMany();
    res.status(200).json(hosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create a new host
export async function createHost(req, res) {
  try {
    const host = await prisma.host.create({
      data: req.body,
    });
    res.status(201).json(host);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Get host by ID
export async function getHostById(req, res) {
  try {
    const host = await prisma.host.findUnique({ where: { id: req.params.id } });
    if (!host) return res.status(404).json({ error: "Host not found" });
    res.status(200).json(host);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update host by ID
export async function updateHost(req, res) {
  try {
    const host = await prisma.host.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(host);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Delete host and set hostId to null in related properties
export async function deleteHost(req, res) {
  try {
    await prisma.property.updateMany({
      where: { hostId: req.params.id },
      data: { hostId: null },
    });
    await prisma.host.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Host deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
