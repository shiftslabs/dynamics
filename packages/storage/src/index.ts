import crypto from "node:crypto";
import { getEnv } from "@shiftslabs/config";

export interface UploadReservation {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  expiresAt: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "video/webm",
];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export async function createUploadReservation(input: {
  businessId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<UploadReservation> {
  if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
    throw new Error("File format is not supported.");
  }

  if (input.sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds maximum upload size (50MB).");
  }

  const env = getEnv();
  const fileExt = input.filename.split(".").pop() || "bin";
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const fileKey = `${input.businessId}/${Date.now()}-${uniqueId}.${fileExt}`;
  
  // Signed upload token
  const token = crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(`${fileKey}:${input.mimeType}:${Date.now() + 3600000}`)
    .digest("hex");

  const uploadUrl = `${env.APP_URL}/api/storage/upload?key=${encodeURIComponent(fileKey)}&token=${token}`;
  const publicUrl = `${env.S3_PUBLIC_BASE_URL}/${fileKey}`;
  const expiresAt = new Date(Date.now() + 3600000).toISOString();

  return {
    uploadUrl,
    fileKey,
    publicUrl,
    expiresAt,
  };
}
