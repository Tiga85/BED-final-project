import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
    const { username, password } = req.body;

    console.log("Login attempt:", { username, password }); // Log the login attempt

    // Fetch user from the database using Prisma
    const user = await prisma.user.findUnique({ where: { username } });
    console.log("User found:", user); // Log the found user

    if (!user || user.password !== password) {
      console.error("Invalid credentials"); // Log invalid credentials
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    console.log("Token generated:", token); // Log the generated token

    res.status(200).json({ message: "Successfully logged in!", token });
  } catch (error) {
    console.error("Login error:", error.message); // Log the error message
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
