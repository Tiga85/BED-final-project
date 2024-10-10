import "./utils/sentryInit.js";
import * as Sentry from "@sentry/node";
import express from "express";
import "dotenv/config";

import { logMiddleware } from "./middleware/logMiddleware.js";
import { router as loginRouter } from "./routes/loginRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import { router as hostRouter } from "./routes/hostRoutes.js";
import { router as propertyRouter } from "./routes/propertyRoutes.js";
import { router as amenityRouter } from "./routes/amenityRoutes.js";
import { router as bookingRouter } from "./routes/bookingRoutes.js";
import { router as reviewRouter } from "./routes/reviewRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";

// Error handling middleware
import notFoundErrorHandler from "./middleware/notFoundErrorHandler.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

// Logging of the duration of all requests
app.use(logMiddleware);

// Login
app.use("/login", loginRouter);

// Bookings
app.use("/users", userRouter);
app.use("/hosts", hostRouter);
app.use("/properties", propertyRouter);
app.use("/amenities", amenityRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);

// Use to see all the json data
app.use("/api", dataRoutes);

app.get("/", (req, res) => {
  const html = "<h1>BED final project: Booking API </h1>";
  res.send(html);
});

// Use Sentry's error handler middleware
app.use(Sentry.Handlers.errorHandler());

app.use(notFoundErrorHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
