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
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Create the user
    const user = await prisma.user.create({
      data: { ...req.body, password: req.body.password },
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
    // Check if the user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    // If the user doesn't exist, return a 404 error
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists, proceed with the update
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error); // Handle any other errors
  }
}

export async function deleteUser(req, res, next) {
  try {
    // Check if the user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set userId to null in related bookings and reviews
    await prisma.booking.updateMany({
      where: { userId: req.params.id },
      data: { userId: null },
    });
    await prisma.review.updateMany({
      where: { userId: req.params.id },
      data: { userId: null },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
}
