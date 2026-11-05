import type { Context } from "hono";

export function ok<T>(c: Context, data: T, meta?: Record<string, unknown>, status = 200) {
  return c.json({ data, ...(meta ? { meta } : {}) }, status as any);
}
export function fail(c: Context, code: string, message: string, status = 400) {
  return c.json({ error: { code, message } }, status as any);
}
export function requireAuth(c: Context) {
  const user = c.get("user");
  if (!user) throw Object.assign(new Error("Authentication required."), { status: 401 });
  return user as { id: string; email: string; isPlatformAdmin: boolean; platformRole: string };
}
export function requireAdmin(c: Context) {
  const user = requireAuth(c);
  if (!user.isPlatformAdmin && user.platformRole !== "admin" && user.platformRole !== "moderator") {
    throw Object.assign(new Error("You do not have access to this resource."), { status: 403 });
  }
  return user;
}
export function getPagination(c: Context, defLimit = 20, maxLimit = 100) {
  const limit = Math.min(maxLimit, Math.max(1, parseInt(c.req.query("limit") || String(defLimit), 10) || defLimit));
  const offset = Math.max(0, parseInt(c.req.query("offset") || "0", 10) || 0);
  return { limit, offset };
}