import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js"; // Import the custom error

const prisma = new PrismaClient();

export async function getAllUsers(req, res, next) {
  try {
    const { username, email, name, phoneNumber } = req.query; // Extract query parameters

    const whereClause = {}; // Initialize an empty object for the "where" clause

    // Add conditions based on the provided query parameters
    if (username) {
      whereClause.username = username;
    }
    if (email) {
      whereClause.email = email;
    }

    if (name) {
      whereClause.name = name;
    }
    if (phoneNumber) {
      whereClause.phoneNumber = phoneNumber;
    }

    // Query the database with filtering
    const users = await prisma.user.findMany({
      where: whereClause, // Apply the where clause
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        // Password is intentionally omitted
      },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await prisma.user.create({
      data: { ...req.body, password: req.body.password }, // Create a new user with hashed password
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
