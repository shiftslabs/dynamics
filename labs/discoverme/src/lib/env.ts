import { z } from "zod";

export const envSchema = z.object({
  APP_URL: z.string().default("http://localhost:8787"),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1),
  DIRECT_DATABASE_URL: z.string().optional(),
  SESSION_SECRET: z.string().min(32),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_BASE_URL: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.string().optional(),
  S3_SIGNED_URL_TTL_SECONDS: z.coerce.number().default(900),
  S3_MAX_UPLOAD_BYTES: z.coerce.number().default(10 * 1024 * 1024),
  S3_ALLOWED_MIME_TYPES: z.string().default("image/jpeg,image/png,image/webp,application/pdf"),
});

export type Env = z.infer<typeof envSchema> & {
  ASSETS?: Fetcher;
  HYPERDRIVE?: Hyperdrive;
};

export function parseEnv(raw: Record<string, unknown>) {
  const r = envSchema.safeParse(raw);
  if (!r.success) {
    const missing = r.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Invalid environment configuration: ${missing}`);
  }
  return r.data;
}