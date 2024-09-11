import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/userService.js";
import { login } from "../services/authService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const token = await login(req.body.username, req.body.password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/users",  getAllUsers);
router.post("/users", authenticateToken, createUser);
router.get("/users/:id",  getUserById);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

export default router;
