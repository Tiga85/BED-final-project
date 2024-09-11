//import instrument from "./sentry/instrument.js";

//import  Sentry from "@sentry/node";

import express from "express";
import { logMiddleware } from "./middleware/logMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";

const app = express();
app.use(express.json());

app.use(logMiddleware);

//app.use("/docs", express.static('docs'));

app.use("/api", userRoutes);
app.use("/api", hostRoutes);
app.use("/api", propertyRoutes);
app.use("/api", amenityRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);
app.use("/api", dataRoutes);

app.get("/", (req, res) => {
  res.send("BED final project: Booking API ");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
