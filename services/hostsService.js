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
              mode: 'insensitive',
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
    const host = await prisma.host.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
}

export async function deleteHost(req, res, next) {
  try {
    await prisma.property.updateMany({
      where: { hostId: req.params.id },
      data: { hostId: null }, // Set hostId to null in related properties
    });
    const deletedHost = await prisma.host.delete({
      where: { id: req.params.id },
    });
    if (!deletedHost) {
      throw new NotFoundError("host", req.params.id);
    }
    res.status(200).json({ message: "Host deleted" });
  } catch (error) {
    next(error);
  }
}
