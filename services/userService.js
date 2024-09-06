import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createUser(req, res) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = await prisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}
export async function deleteUser(req, res) {
  try {
    // Set userId to null for related bookings and reviews
    await prisma.booking.updateMany({
      where: { userId: req.params.id },
      data: { userId: null },
    });
    await prisma.review.updateMany({
      where: { userId: req.params.id },
      data: { userId: null },
    });

    // Now delete the user
    await prisma.user.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
