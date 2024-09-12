import { logger } from "../utils/log.js";

 function logMiddleware(req, res, next) {
  const start = new Date();

  next(); // Pass the request to the next middleware

  const end = new Date();
  const ms = end - start;

  logger.info(
    `${req.method} 
    ${req.originalUrl}. 
    Status: ${res.statusCode}. 
    Duration: ${ms} ms`
  );
}
export default logMiddleware;
