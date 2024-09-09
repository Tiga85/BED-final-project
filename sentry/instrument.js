import  Sentry from "@sentry/node"; 


import { nodeProfilingIntegration }  from "@sentry/profiling-node";

Sentry.init({
 // dsn: "https://0d82d19c2231f0a637d03a0044c55b9a@o4507921963679744.ingest.de.sentry.io/4507921985896528",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});


export default Sentry;