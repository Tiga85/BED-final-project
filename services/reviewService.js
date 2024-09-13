import { PrismaClient } from "@prisma/client";
import NotFoundError from "../errors/NotFoundError.js"; // Import custom error class

const prisma = new PrismaClient();

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true, // Include the user who wrote the review
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
    const review = await prisma.review.create({
      data: req.body,
    });
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
        user: true, // Include the user who wrote the review
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
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const deletedReview = await prisma.review.delete({
      where: { id: req.params.id },
    });
    if (!deletedReview) {
      throw new NotFoundError("review", req.params.id);
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
}
