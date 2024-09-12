import * as Sentry from "@sentry/node";
import express from "express";
import "dotenv/config";

import logMiddleware from "./middleware/logMiddleware.js";
import loginRouter from "./routes/loginRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import notFoundErrorHandler from "./middleware/notFoundErrorHandler.js";
import errorHandler from "./errors/errorHandler.js";

// Custom integration example
class CustomIntegration {
  setupOnce() {
    console.log("Custom integration setup");
  }
}

Sentry.init({
  dsn: "https://0d82d19c2231f0a637d03a0044c55b9a@o4507921963679744.ingest.de.sentry.io/4507921985896528",
  integrations: [new CustomIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const app = express();
app.use(express.json());
app.use(logMiddleware);

app.use("/api", loginRouter);
app.use("/api", userRoutes);
app.use("/api", hostRoutes);
app.use("/api", propertyRoutes);
app.use("/api", amenityRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);
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
