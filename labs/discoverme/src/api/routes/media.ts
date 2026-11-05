import { Hono } from "hono";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { mediaAssets, businessMemberships } from "../../db/schema";
import { ok, fail, requireAuth } from "../../lib/http";
import { randomToken } from "../../lib/crypto";

export const media = new Hono<{ Bindings: Env }>();

async function canUseBiz(db:any,bid:string,uid:string){ if(!bid) return true; const [m]=await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId,bid),eq(businessMemberships.userId,uid),eq(businessMemberships.status,"active"))).limit(1); return !!m; }

media.post("/upload-intents", async (c) => {
  const u = requireAuth(c);
  const b = z.object({ filename: z.string().min(1).max(255), mimeType: z.string().min(1), sizeBytes: z.number().int().positive(), purpose: z.string().default("general"), businessId: z.string().uuid().optional() }).safeParse(await c.req.json().catch(()=>null));
  if (!b.success) return fail(c,"VALIDATION_ERROR","Invalid upload request.",422);
  const db = getDb(c.env);
  if (b.data.businessId && !await canUseBiz(db,b.data.businessId,u.id)) return fail(c,"FORBIDDEN","Access denied.",403);
  const allowed = (c.env.S3_ALLOWED_MIME_TYPES||"image/jpeg,image/png,image/webp,application/pdf").split(",").map(s=>s.trim());
  if (!allowed.includes(b.data.mimeType)) return fail(c,"VALIDATION_ERROR","File type is not allowed.",422);
  const max = c.env.S3_MAX_UPLOAD_BYTES || 10485760;
  if (b.data.sizeBytes > max) return fail(c,"VALIDATION_ERROR","File is too large.",422);
  if (!c.env.S3_BUCKET || !c.env.S3_ENDPOINT) return fail(c,"STORAGE_NOT_CONFIGURED","File storage is not configured for this environment.",503);
  const ext = (b.data.filename.split(".").pop()||"bin").replace(/[^a-zA-Z0-9]/g,"").slice(0,8);
  const objectKey = `uploads/${u.id}/${Date.now()}-${randomToken(8)}.${ext}`;
  // presigned URL generation requires S3 signing; return intent with object key for client/server flow
  const intentToken = randomToken(24);
  const [asset] = await db.insert(mediaAssets).values({ ownerId: u.id, businessId: b.data.businessId||null, bucket: c.env.S3_BUCKET, objectKey, mimeType: b.data.mimeType, sizeBytes: b.data.sizeBytes, purpose: b.data.purpose, status: "pending", url: c.env.S3_PUBLIC_BASE_URL ? `${c.env.S3_PUBLIC_BASE_URL.replace(/\/$/,"")}/${objectKey}` : null }).returning();
  return ok(c, { assetId: asset.id, objectKey, intentToken, uploadUrl: `/api/v1/media/proxy-upload/${asset.id}`, method: "PUT", expiresIn: c.env.S3_SIGNED_URL_TTL_SECONDS||900, note: "Use configured S3 presigned uploads in production; proxy-upload endpoint accepts authorized uploads when S3 direct signing is not available." }, undefined, 201);
});

media.post("/complete", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env);
  const { assetId } = z.object({ assetId: z.string().uuid() }).parse(await c.req.json().catch(()=>({})));
  const [row] = await db.select().from(mediaAssets).where(and(eq(mediaAssets.id,assetId), eq(mediaAssets.ownerId,u.id))).limit(1);
  if (!row) return fail(c,"NOT_FOUND","Upload not found.",404);
  const [out] = await db.update(mediaAssets).set({ status: "active" }).where(eq(mediaAssets.id,assetId)).returning();
  return ok(c, out);
});
media.get("/:mediaId", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env);
  const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id,c.req.param("mediaId"))).limit(1);
  if (!row) return fail(c,"NOT_FOUND","Not found.",404);
  if (row.ownerId !== u.id && !u.isPlatformAdmin) {
    if (row.businessId) { const [m]=await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId,row.businessId),eq(businessMemberships.userId,u.id))).limit(1); if(!m) return fail(c,"FORBIDDEN","Access denied.",403); }
    else if (row.status!=="active") return fail(c,"FORBIDDEN","Access denied.",403);
  }
  return ok(c, row);
});
media.delete("/:mediaId", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env);
  const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id,c.req.param("mediaId"))).limit(1);
  if (!row) return fail(c,"NOT_FOUND","Not found.",404);
  if (row.ownerId !== u.id && !u.isPlatformAdmin) return fail(c,"FORBIDDEN","Access denied.",403);
  await db.update(mediaAssets).set({ status: "deleted" }).where(eq(mediaAssets.id,row.id));
  return ok(c, { deleted: true });
});
media.post("/:mediaId/attach", async (c)=>{ requireAuth(c); return ok(c,{ attached:true, note:"Attachment handled by resource-specific endpoints." }); });
media.delete("/:mediaId/attach", async (c)=>{ requireAuth(c); return ok(c,{ detached:true }); });