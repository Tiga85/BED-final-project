import { logger } from "../utils/log.js";

export function logMiddleware(req, res, next) {
  const start = process.hrtime(); // Start high-resolution timer

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start); // End high-resolution timer
    const milliseconds = (seconds * 1e3) + (nanoseconds / 1e6);

    // Convert duration to hours, minutes, seconds
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((milliseconds % (1000 * 60)) / 1000);
    const duration = `${hours}h ${minutes}m ${secs}s`;

    // Log request information and duration
    logger.info(
      `${req.method} ${req.originalUrl}. Status: ${res.statusCode}. Duration: ${duration}`
    );
  });

  next(); // Pass the request to the next middleware
}
