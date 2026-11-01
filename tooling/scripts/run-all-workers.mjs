import { executeSchedulerTick } from "../../workers/scheduler/src/index.js";

console.log("[Shiftslabs Worker Manager] Initializing background workers...");

executeSchedulerTick().catch((err) => {
  console.error("[Shiftslabs Worker Manager] Initial tick error:", err);
});

// Run every 30 minutes
setInterval(() => {
  executeSchedulerTick().catch((err) => {
    console.error("[Shiftslabs Worker Manager] Scheduled tick error:", err);
  });
}, 30 * 60 * 1000);

console.log("[Shiftslabs Worker Manager] Background workers active and polling on 30-minute intervals.");
