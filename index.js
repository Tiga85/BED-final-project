//import instrument from "./sentry/instrument.js";

//import  Sentry from "@sentry/node"; 

import express from "express";

import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(express.json());

/*
app.get("/", function rootHandler (req, res) {
  res.send("Hello world!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);


// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

*/
app.use("/api", userRoutes);
app.use("/api", hostRoutes);
app.use("/api", propertyRoutes);
app.use("/api", amenityRoutes);
app.use("/api", bookingRoutes);
app.use("/api", reviewRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});


app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});