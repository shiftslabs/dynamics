import { Hono } from "hono";
import { z } from "zod";
import { eq, and, isNull, gt } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { users, userProfiles, userPreferences, emailVerificationTokens, passwordResetTokens, sessions, notificationPreferences } from "../../db/schema";
import { hashPassword, verifyPassword, randomToken, sha256 } from "../../lib/crypto";
import { createSession, destroySession } from "../../lib/session";
import { ok, fail, requireAuth } from "../../lib/http";

export const auth = new Hono<{ Bindings: Env }>();

const Register = z.object({ email: z.string().email(), password: z.string().min(8).max(128), name: z.string().min(1).max(120).optional() });
const Login = z.object({ email: z.string().email(), password: z.string().min(1) });

auth.post("/register", async (c) => {
  const body = Register.safeParse(await c.req.json().catch(() => null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Please check your details and try again.", 422);
  const db = getDb(c.env);
  const email = body.data.email.toLowerCase().trim();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) return fail(c, "EMAIL_TAKEN", "An account with that email already exists.", 409);
  const passwordHash = await hashPassword(body.data.password);
  const [user] = await db.insert(users).values({ email, name: body.data.name || null, passwordHash }).returning();
  await db.insert(userProfiles).values({ userId: user.id }).onConflictDoNothing();
  await db.insert(userPreferences).values({ userId: user.id }).onConflictDoNothing();
  await db.insert(notificationPreferences).values({ userId: user.id }).onConflictDoNothing();
  // email verification token (delivery depends on configured provider; token is persisted)
  const token = randomToken(32);
  await db.insert(emailVerificationTokens).values({ userId: user.id, email, tokenHash: await sha256(token), expiresAt: new Date(Date.now() + 24 * 3600000) });
  await createSession(c, user.id);
  return ok(c, { id: user.id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified, verificationRequired: true, emailDelivery: c.env.EMAIL_PROVIDER ? "sent" : "not_configured" }, undefined, 201);
});

auth.post("/login", async (c) => {
  const body = Login.safeParse(await c.req.json().catch(() => null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Please provide your email and password.", 422);
  const db = getDb(c.env);
  const email = body.data.email.toLowerCase().trim();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.passwordHash || !(await verifyPassword(body.data.password, user.passwordHash))) {
    return fail(c, "INVALID_CREDENTIALS", "The email or password is incorrect.", 401);
  }
  if (user.status !== "active") return fail(c, "ACCOUNT_RESTRICTED", "This account cannot be accessed right now.", 403);
  await createSession(c, user.id);
  return ok(c, { id: user.id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified, isPlatformAdmin: user.isPlatformAdmin, platformRole: user.platformRole });
});

auth.post("/logout", async (c) => { await destroySession(c); return ok(c, { success: true }); });

auth.get("/session", async (c) => {
  const u = c.get("user");
  return ok(c, u ? { authenticated: true, user: u } : { authenticated: false, user: null });
});

auth.post("/verify-email", async (c) => {
  const { token } = (await c.req.json().catch(() => ({}))) as any;
  if (!token) return fail(c, "VALIDATION_ERROR", "Verification token is required.", 422);
  const db = getDb(c.env);
  const tokenHash = await sha256(token);
  const [row] = await db.select().from(emailVerificationTokens).where(and(eq(emailVerificationTokens.tokenHash, tokenHash), isNull(emailVerificationTokens.usedAt), gt(emailVerificationTokens.expiresAt, new Date()))).limit(1);
  if (!row) return fail(c, "INVALID_TOKEN", "This verification link is invalid or has expired.", 400);
  await db.update(emailVerificationTokens).set({ usedAt: new Date() }).where(eq(emailVerificationTokens.id, row.id));
  await db.update(users).set({ isEmailVerified: true, updatedAt: new Date() }).where(eq(users.id, row.userId));
  return ok(c, { verified: true });
});

auth.post("/resend-verification", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const [user] = await db.select().from(users).where(eq(users.id, u.id)).limit(1);
  if (!user) return fail(c, "NOT_FOUND", "Account not found.", 404);
  if (user.isEmailVerified) return ok(c, { alreadyVerified: true });
  const token = randomToken(32);
  await db.insert(emailVerificationTokens).values({ userId: user.id, email: user.email, tokenHash: await sha256(token), expiresAt: new Date(Date.now() + 24 * 3600000) });
  return ok(c, { requested: true, emailDelivery: c.env.EMAIL_PROVIDER ? "sent" : "not_configured" });
});

auth.post("/forgot-password", async (c) => {
  const { email } = (await c.req.json().catch(() => ({}))) as any;
  // always return success to avoid account enumeration
  if (typeof email === "string" && email.includes("@")) {
    try {
      const db = getDb(c.env);
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
      if (user && user.status === "active") {
        const token = randomToken(32);
        await db.insert(passwordResetTokens).values({ userId: user.id, tokenHash: await sha256(token), expiresAt: new Date(Date.now() + 3600000) });
      }
    } catch { /* no-op */ }
  }
  return ok(c, { requested: true });
});

auth.post("/reset-password", async (c) => {
  const body = z.object({ token: z.string().min(1), password: z.string().min(8).max(128) }).safeParse(await c.req.json().catch(() => null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Please provide a valid password.", 422);
  const db = getDb(c.env);
  const tokenHash = await sha256(body.data.token);
  const [row] = await db.select().from(passwordResetTokens).where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date()))).limit(1);
  if (!row) return fail(c, "INVALID_TOKEN", "This reset link is invalid or has expired.", 400);
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, row.id));
  await db.update(users).set({ passwordHash: await hashPassword(body.data.password), updatedAt: new Date() }).where(eq(users.id, row.userId));
  // revoke existing sessions
  await db.update(sessions).set({ revokedAt: new Date() }).where(and(eq(sessions.userId, row.userId), isNull(sessions.revokedAt)));
  return ok(c, { reset: true });
});

auth.get("/sessions", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  const rows = await db.select({ id: sessions.id, userAgent: sessions.userAgent, expiresAt: sessions.expiresAt, createdAt: sessions.createdAt }).from(sessions)
    .where(and(eq(sessions.userId, u.id), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date()))).orderBy(sessions.createdAt);
  return ok(c, rows);
});

auth.delete("/sessions/:sessionId", async (c) => {
  const u = requireAuth(c);
  const db = getDb(c.env);
  await db.update(sessions).set({ revokedAt: new Date() }).where(and(eq(sessions.id, c.req.param("sessionId")), eq(sessions.userId, u.id)));
  return ok(c, { revoked: true });
});