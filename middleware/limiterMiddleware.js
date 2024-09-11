/* 
// Create a rate limiter middleware
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Allow 5 requests per minute
    message: 'Too many requests from this IP, please try again later.',
 });
  // Apply the rate limiter middleware to all requests
 app.use(limiter);

 */
