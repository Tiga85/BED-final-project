import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function login(username, password) {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";

  console.log("Login attempt:", { username, password }); // Log the login attempt

  // Fetch user from the database using Prisma
  const user = await prisma.user.findUnique({
    where: { username, password },
  });

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials!");
  }

  const token = jwt.sign({ userId: user.id }, secretKey);
  console.log("Token generated:", token); // Log the generated token

  return {
    message: "Successfully logged in!",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.password,
    },
    token,
  };
}
