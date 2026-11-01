import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

function loadShiftslabsEnv(): void {
  const possiblePaths = [
    path.resolve(process.cwd(), "shiftslabs.env"),
    path.resolve(process.cwd(), "../../shiftslabs.env"),
    path.resolve(process.cwd(), "../../../shiftslabs.env"),
    path.resolve(__dirname, "../../../shiftslabs.env"),
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf-8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // Safe silent ignore for missing or unreadable files
      }
      break;
    }
  }
}

loadShiftslabsEnv();

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "staging", "production"]).default("local"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16).default("shiftslabs_dev_auth_secret_minimum_16_chars"),
  
  DATABASE_URL: z.string().default("postgresql://shiftslabs_user:shiftslabs_password@localhost:5432/shiftslabs_db?schema=public"),
  DIRECT_DATABASE_URL: z.string().optional(),
  
  PAYSTACK_SECRET_KEY: z.string().default("sk_test_mock_shiftslabs_secret_key"),
  PAYSTACK_PUBLIC_KEY: z.string().default("pk_test_mock_shiftslabs_public_key"),
  PAYSTACK_WEBHOOK_SECRET: z.string().default("shiftslabs_paystack_webhook_signing_secret"),
  
  RESEND_API_KEY: z.string().default("re_test_mock_key"),
  RESEND_FROM_EMAIL: z.string().default("Shiftslabs <notifications@shiftslabs.com>"),
  
  S3_ENDPOINT: z.string().default("https://r2.cloudflarestorage.com"),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().default("shiftslabs-storage"),
  S3_ACCESS_KEY_ID: z.string().default("test_access_key"),
  S3_SECRET_ACCESS_KEY: z.string().default("test_secret_key"),
  S3_PUBLIC_BASE_URL: z.string().default("https://media.shiftslabs.com"),
  
  AI_PROVIDER: z.enum(["gemini", "openai", "claude", "local"]).default("gemini"),
  AI_API_KEY: z.string().default("test_ai_key"),
  AI_BASE_URL: z.string().default("https://generativelanguage.googleapis.com"),
  AI_MODEL: z.string().default("gemini-1.5-flash"),
  
  VAPID_PUBLIC_KEY: z.string().default("test_vapid_public"),
  VAPID_PRIVATE_KEY: z.string().default("test_vapid_private"),
  VAPID_SUBJECT: z.string().default("mailto:security@shiftslabs.com"),
  
  REALTIME_PROVIDER: z.enum(["websocket", "memory"]).default("websocket"),
  REALTIME_URL: z.string().default("ws://localhost:4000"),
  REALTIME_PORT: z.coerce.number().default(4000),
  
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ERROR_TRACKING_DSN: z.string().optional(),
  
  SCHEDULER_SECRET: z.string().default("shiftslabs_scheduler_secret"),
  WORKER_CONCURRENCY: z.coerce.number().default(5),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;

export function getEnv(): EnvConfig {
  if (!parsedEnv) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.warn("Shiftslabs config warning: Invalid environment variables detected. Using safe defaults.", result.error.format());
      parsedEnv = envSchema.parse({});
    } else {
      parsedEnv = result.data;
    }
  }
  return parsedEnv;
}
