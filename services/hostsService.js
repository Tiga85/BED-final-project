import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js";

const prisma = new PrismaClient();

export async function getAllHosts(req, res, next) {
  try {
    const { name } = req.query; // Get the name query parameter from the request

    // If a name is provided, filter by the name; otherwise, return all hosts
    const hosts = await prisma.host.findMany({
      where: name
        ? {
            name: {
              contains: name, // Perform a case-insensitive match (substring search)
              mode: "insensitive",
            },
          }
        : {}, // If no name query parameter, return all hosts
    });

    res.status(200).json(hosts);
  } catch (error) {
    next(error);
  }
}

export async function createHost(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Create the host
    const host = await prisma.host.create({
      data: req.body,
    });

    res.status(201).json(host);
  } catch (error) {
    next(error);
  }
}

export async function getHostById(req, res, next) {
  try {
    const host = await prisma.host.findUnique({ where: { id: req.params.id } });
    if (!host) {
      throw new NotFoundError("host", req.params.id);
    }
    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
}

export async function updateHost(req, res, next) {
  try {
    // Check if the host exists
    const existingHost = await prisma.host.findUnique({
      where: { id: req.params.id },
    });

    if (!existingHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    // Update the host
    const updatedHost = await prisma.host.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(updatedHost);
  } catch (error) {
    next(error);
  }
}

export async function deleteHost(req, res, next) {
  try {
    // Check if the host exists
    const existingHost = await prisma.host.findUnique({
      where: { id: req.params.id },
    });

    if (!existingHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    // Set hostId to null in related properties
    await prisma.property.updateMany({
      where: { hostId: req.params.id },
      data: { hostId: null },
    });

    // Delete the host
    await prisma.host.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Host deleted" });
  } catch (error) {
    next(error);
  }
}
