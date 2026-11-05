import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Context, Next } from "hono";
import { eq, and, gt, isNull } from "drizzle-orm";
import { sessions, users } from "../db/schema";
import { getDb } from "../db/client";
import { randomToken, sha256 } from "./crypto";
import type { Env } from "./env";

const COOKIE = "dm_session";
const SESSION_DAYS = 30;

export async function createSession(c: Context<{ Bindings: Env }>, userId: string) {
  const db = getDb(c.env);
  const token = randomToken(32);
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await db.insert(sessions).values({ userId, tokenHash, expiresAt, userAgent: c.req.header("user-agent")?.slice(0, 255) });
  const secure = (c.env.APP_URL || "").startsWith("https");
  setCookie(c, COOKIE, token, { path: "/", httpOnly: true, secure, sameSite: "Lax", expires: expiresAt });
  return token;
}

export async function destroySession(c: Context<{ Bindings: Env }>) {
  const token = getCookie(c, COOKIE);
  if (token) {
    const db = getDb(c.env);
    const tokenHash = await sha256(token);
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.tokenHash, tokenHash));
  }
  deleteCookie(c, COOKIE, { path: "/" });
}

export async function sessionMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const token = getCookie(c, COOKIE);
  c.set("user", null);
  if (token) {
    try {
      const db = getDb(c.env);
      const tokenHash = await sha256(token);
      const rows = await db.select({ session: sessions, user: users })
        .from(sessions).innerJoin(users, eq(sessions.userId, users.id))
        .where(and(eq(sessions.tokenHash, tokenHash), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date())))
        .limit(1);
      if (rows[0] && rows[0].user.status === "active") {
        c.set("user", { id: rows[0].user.id, email: rows[0].user.email, name: rows[0].user.name, isPlatformAdmin: rows[0].user.isPlatformAdmin, platformRole: rows[0].user.platformRole });
      }
    } catch (e) { /* session lookup failed; treat as unauthenticated */ }
  }
  await next();
}