import { getEnv } from "@shiftslabs/config";

export interface LogContext {
  requestId?: string;
  userId?: string;
  businessId?: string;
  path?: string;
  [key: string]: any;
}

export function createStructuredLogger(moduleName: string) {
  const env = getEnv();

  function formatLog(level: "info" | "warn" | "error" | "debug", message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      module: moduleName,
      message,
      ...context,
    };
    return JSON.stringify(entry);
  }

  return {
    info(message: string, context?: LogContext) {
      console.log(formatLog("info", message, context));
    },
    warn(message: string, context?: LogContext) {
      console.warn(formatLog("warn", message, context));
    },
    error(message: string, context?: LogContext) {
      console.error(formatLog("error", message, context));
    },
    debug(message: string, context?: LogContext) {
      if (env.LOG_LEVEL === "debug") {
        console.log(formatLog("debug", message, context));
      }
    },
  };
}

export async function checkSystemHealth() {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };
}
