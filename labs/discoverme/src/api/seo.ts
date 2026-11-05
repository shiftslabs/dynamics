import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import type { Env } from "../lib/env";
import { getDb } from "../db/client";
import { businesses, products, services, communities, categories } from "../db/schema";

export const seo = new Hono<{ Bindings: Env }>();

seo.get("/robots.txt", (c) => {
  const base = c.env.APP_URL || "https://discoverme.shiftslabs.workers.dev";
  return c.text(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /account/\nDisallow: /business/\nDisallow: /admin/\nDisallow: /messages/\nSitemap: ${base}/sitemap.xml\n`);
});

seo.get("/sitemap.xml", async (c) => {
  const base = c.env.APP_URL || "https://discoverme.shiftslabs.workers.dev";
  const staticPaths = ["/","/about","/how-it-works","/for-businesses","/categories","/discover","/search","/communities","/privacy","/terms","/community-guidelines","/review-policy","/safety","/contact","/help"];
  let dynamic = "";
  try {
    const db = getDb(c.env);
    const [biz, prods, svcs, comms, cats] = await Promise.all([
      db.select({ slug: businesses.slug, updatedAt: businesses.updatedAt }).from(businesses).where(eq(businesses.status, "published")).limit(5000),
      db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.status, "published")).limit(5000),
      db.select({ slug: services.slug, updatedAt: services.updatedAt }).from(services).where(eq(services.status, "published")).limit(5000),
      db.select({ slug: communities.slug, updatedAt: communities.updatedAt }).from(communities).where(and(eq(communities.status, "active"), eq(communities.visibility, "public"))).limit(2000),
      db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories).where(eq(categories.status, "published")).limit(500),
    ]);
    const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
    const url = (loc: string, last?: Date | null) => `<url><loc>${esc(base+loc)}</loc>${last?`<lastmod>${last.toISOString().split("T")[0]}</lastmod>`:""}</url>`;
    dynamic = [
      ...cats.map(x=>url(`/categories/${x.slug}`, x.updatedAt)),
      ...biz.map(x=>url(`/business/${x.slug}`, x.updatedAt)),
      ...prods.map(x=>url(`/products/${x.slug}`, x.updatedAt)),
      ...svcs.map(x=>url(`/services/${x.slug}`, x.updatedAt)),
      ...comms.map(x=>url(`/communities/${x.slug}`, x.updatedAt)),
    ].join("");
  } catch { /* sitemap degrades to static routes if DB unavailable */ }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPaths.map(p=>`<url><loc>${base}${p}</loc></url>`).join("")}${dynamic}</urlset>`;
  return c.body(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});