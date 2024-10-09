import express from "express";
import { login } from "../services/loginService.js";

export const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error.message); // Log the error message
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});