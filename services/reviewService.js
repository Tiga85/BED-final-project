import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all reviews
export async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,      // Include the user who wrote the review
        property: true,  // Include the property being reviewed
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create a new review
export async function createReview(req, res) {
  try {
    const review = await prisma.review.create({
      data: req.body,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Get review by ID
export async function getReviewById(req, res) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,      // Include the user who wrote the review
        property: true,  // Include the property being reviewed
      },
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update review by ID
export async function updateReview(req, res) {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  }
}

// Delete review by ID
export async function deleteReview(req, res) {
  try {
    await prisma.review.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
