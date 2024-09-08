import express from "express";

import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", hostRoutes);
app.use("/api", propertyRoutes);
app.use("/api", amenityRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
