import express from "express";
import { login } from "../services/login.js";

export const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error.message); // Log the error message
    res.status(401).json({ message: error.message });
  }
});