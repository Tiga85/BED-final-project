import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = process.env.AUTH_SECRET_KEY;

export async function login(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
  return token;
}
