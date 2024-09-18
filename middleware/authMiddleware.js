import jwt from "jsonwebtoken";

const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";

//token generator
const token = jwt.sign(
  { userId: "user123" }, // Payload (example userId)
  secretKey, // Your secret key
  { expiresIn: "1h" } // Token expires in 1 hour
);

//console.log(token); uncomment this line to see the token for use

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Split 'Bearer <token>'

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token." });
    req.user = user; // Attach decoded user to request
    next();
  });
}
