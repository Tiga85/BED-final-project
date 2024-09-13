import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import NotFoundError from "../errors/NotFoundError.js"; // Import the custom error

const prisma = new PrismaClient();

export async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

export async function createUser(req, res, next) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = await prisma.user.create({
      data: { ...req.body, password: hashedPassword }, // Create a new user with hashed password
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      throw new NotFoundError("user", req.params.id); // Throw custom 404 error
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.booking.updateMany({
      where: { userId: req.params.id },
      data: { userId: null }, // Set userId to null in related bookings
    });
    await prisma.review.updateMany({
      where: { userId: req.params.id },
      data: { userId: null }, // Set userId to null in related reviews
    });

    const deletedUser = await prisma.user.delete({
      where: { id: req.params.id },
    });
    if (!deletedUser) {
      throw new NotFoundError("user", req.params.id);
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
}
