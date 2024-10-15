import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js"; // Import custom error class

const prisma = new PrismaClient();

export async function getAllReviews(req, res, next) {
  try {
    const { userId, propertyId } = req.query; // Extract query parameters

    // Initialize the "where" clause object
    const whereClause = {};

    // If userId is provided, add it to the "where" clause
    if (userId) {
      whereClause.userId = userId;
    }

    // If propertyId is provided, add it to the "where" clause
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }
    // Query the reviews based on the "where" clause
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            // Password is intentionally excluded
          },
        }, // Include the user who wrote the review
        property: true, // Include the property being reviewed
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { propertyId, comment, rating, userId } = req.body;

    // Validate that propertyId, comment, and rating are provided
    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required." });
    }
    if (!comment) {
      return res.status(400).json({ message: "Comment is required." });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: "Rating is required." });
    }
    if (typeof rating !== "number") {
      return res.status(400).json({ message: "Rating must be a number." });
    }

    // Create the review in the database
    const review = await prisma.review.create({
      data: {
        propertyId,
        comment,
        rating,
        userId, // userId is optional
      },
    });

    // Send response with created review
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

export async function getReviewById(req, res, next) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            // Password is intentionally excluded
          },
        }, // Include the user who wrote the review
        property: true, // Include the property being reviewed
      },
    });
    if (!review) {
      throw new NotFoundError("review", req.params.id);
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req, res, next) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
}
