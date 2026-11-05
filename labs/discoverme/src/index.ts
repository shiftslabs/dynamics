import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import type { Env } from "./lib/env";
import { api } from "./api";
import { seo } from "./api/seo";

const app = new Hono<{ Bindings: Env }>();

app.use("*", secureHeaders());
app.use("*", logger());
app.use("/api/*", async (c, next) => {
  const origin = c.env.APP_URL || "";
  return cors({
    origin: origin ? [origin, "http://localhost:5173", "http://127.0.0.1:8787"] : "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: true,
    maxAge: 86400,
  })(c, next);
});

app.get("/api/health", (c) => c.json({ data: { ok: true, service: "discoverme" } }));
app.route("/api/v1", api);
app.route("/", seo);

app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: { code: "NOT_FOUND", message: "The requested resource was not found." } }, 404);
  }
  return c.env.ASSETS ? c.env.ASSETS.fetch(c.req.raw) : c.text("Not found", 404);
});

app.onError((err, c) => {
  console.error("discoverme_error", err);
  const code = (err as any).status === 401 ? "UNAUTHORIZED" : (err as any).status === 403 ? "FORBIDDEN" : "INTERNAL_ERROR";
  const status = ((err as any).status as number) || 500;
  const message = status >= 500 ? "We could not complete that request. Please try again." : (err.message || "Request failed.");
  return c.json({ error: { code, message } }, status as any);
});

export default app;