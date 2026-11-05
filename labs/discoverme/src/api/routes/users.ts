import { Hono } from "hono";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { users, userProfiles, userPreferences, notifications, notificationPreferences, userBlocks, accountDeletionRequests, dataExportRequests } from "../../db/schema";
import { ok, fail, requireAuth } from "../../lib/http";

export const users = new Hono<{ Bindings: Env }>();

users.get("/me", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const [row] = await db.select().from(users).where(eq(users.id, u.id)).limit(1);
  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, u.id)).limit(1);
  if (!row) return fail(c, "NOT_FOUND", "Account not found.", 404);
  return ok(c, { id: row.id, email: row.email, name: row.name, isEmailVerified: row.isEmailVerified, isPlatformAdmin: row.isPlatformAdmin, platformRole: row.platformRole, profile: profile || null });
});

users.patch("/me", async (c) => {
  const u = requireAuth(c);
  const body = z.object({ name: z.string().min(1).max(120).optional(), profile: z.object({ bio: z.string().max(500).optional(), location: z.string().max(120).optional(), phone: z.string().max(40).optional(), locale: z.string().max(10).optional(), timezone: z.string().max(60).optional(), isPublic: z.boolean().optional() }).optional() }).safeParse(await c.req.json().catch(()=>null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Please check your details.", 422);
  const db = getDb(c.env);
  if (body.data.name !== undefined) await db.update(users).set({ name: body.data.name, updatedAt: new Date() }).where(eq(users.id, u.id));
  if (body.data.profile) await db.update(userProfiles).set({ ...body.data.profile, updatedAt: new Date() }).where(eq(userProfiles.userId, u.id));
  return ok(c, { updated: true });
});

users.get("/me/preferences", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const [row] = await db.select().from(userPreferences).where(eq(userPreferences.userId, u.id)).limit(1);
  return ok(c, row || { interests: [], discoveryLocation: null, theme: "light", data: {} });
});

users.patch("/me/preferences", async (c) => {
  const u = requireAuth(c);
  const body = z.object({ interests: z.array(z.string()).optional(), discoveryLocation: z.string().nullable().optional(), theme: z.string().optional(), data: z.record(z.unknown()).optional() }).safeParse(await c.req.json().catch(()=>null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Invalid preferences.", 422);
  const db = getDb(c.env);
  await db.update(userPreferences).set({ ...body.data, updatedAt: new Date() } as any).where(eq(userPreferences.userId, u.id));
  return ok(c, { updated: true });
});

users.get("/me/notifications", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const rows = await db.select().from(notifications).where(eq(notifications.userId, u.id)).orderBy(desc(notifications.createdAt)).limit(50);
  return ok(c, rows);
});

users.patch("/me/notifications/:id", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const { isRead } = (await c.req.json().catch(()=>({}))) as any;
  await db.update(notifications).set({ isRead: !!isRead, readAt: isRead ? new Date() : null }).where(and(eq(notifications.id, c.req.param("id")), eq(notifications.userId, u.id)));
  return ok(c, { updated: true });
});

users.post("/me/data-exports", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const [row] = await db.insert(dataExportRequests).values({ userId: u.id, status: "requested" }).returning();
  return ok(c, row, undefined, 201);
});

users.post("/me/deletion-requests", async (c) => {
  const u = requireAuth(c);
  const { reason } = (await c.req.json().catch(()=>({}))) as any;
  const db = getDb(c.env);
  const [row] = await db.insert(accountDeletionRequests).values({ userId: u.id, reason: reason || null, status: "requested" }).onConflictDoUpdate({ target: accountDeletionRequests.userId, set: { status: "requested", reason: reason || null, requestedAt: new Date() } }).returning();
  return ok(c, row, undefined, 201);
});

users.post("/:userId/block", async (c) => {
  const u = requireAuth(c);
  const target = c.req.param("userId");
  if (target === u.id) return fail(c, "INVALID_REQUEST", "You cannot block yourself.", 400);
  const db = getDb(c.env);
  await db.insert(userBlocks).values({ blockerId: u.id, blockedId: target }).onConflictDoNothing();
  return ok(c, { blocked: true });
});
users.delete("/:userId/block", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  await db.delete(userBlocks).where(and(eq(userBlocks.blockerId, u.id), eq(userBlocks.blockedId, c.req.param("userId"))));
  return ok(c, { unblocked: true });
});
users.post("/:userId/report", async (c) => {
  const u = requireAuth(c);
  const { reason, details } = (await c.req.json().catch(()=>({}))) as any;
  if (!reason) return fail(c, "VALIDATION_ERROR", "A reason is required.", 422);
  const db = getDb(c.env);
  const { reports } = await import("../../db/schema");
  const [row] = await db.insert(reports).values({ reporterId: u.id, targetType: "user", targetId: c.req.param("userId"), reason, details: details || null }).returning();
  return ok(c, { id: row.id, status: row.status }, undefined, 201);
});