import "./utils/sentryInit.js";
import * as Sentry from "@sentry/node";
import express from "express";
import "dotenv/config";

import { logMiddleware } from "./middleware/logMiddleware.js";
import { router as loginRouter } from "./routes/loginRoutes.js";
import { router as usersRouter } from "./routes/userRoutes.js";
import { router as hostRouter } from "./routes/hostRoutes.js"; // Import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import { router as bookingRouter } from "./routes/bookingRoutes.js"; // Import bookingRoutes from "./routes/bookingRoutes.js";
import { router as reviewRouter } from "./routes/reviewRoutes.js"; // Import reviewRoute from "./routes/reviewRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import notFoundErrorHandler from "./middleware/notFoundErrorHandler.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

// Logging of the duration of all requests
app.use(logMiddleware);

// Login
app.use("/login", loginRouter);

app.use("/users", usersRouter);
app.use("/hosts", hostRouter);
app.use("/api", propertyRoutes);
app.use("/api", amenityRoutes);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
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
