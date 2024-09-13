import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
dotenv.config();

//import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Custom integration example
class CustomIntegration {
  setupOnce() {
    //  console.log("Custom integration setup");
  }
}

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Access the DSN from the environment
  integrations: [new CustomIntegration()],
  // Tracing
  tracesSampleRate: 10.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 10.0,
});
