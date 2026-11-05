import { Hono } from "hono";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { businesses, businessMemberships, businessInvitations, businessSettings, businessHours, businessClaims } from "../../db/schema";
import { ok, fail, requireAuth } from "../../lib/http";
import { slugify, randomToken, sha256 } from "../../lib/crypto";

export const businessesRoute = new Hono<{ Bindings: Env }>();
export { businessesRoute as businesses };

async function getMembership(db: any, businessId: string, userId: string) {
  const [m] = await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId, businessId), eq(businessMemberships.userId, userId), eq(businessMemberships.status,"active"))).limit(1);
  return m;
}
const canManage = (role?: string) => role === "owner" || role === "manager";

businessesRoute.post("/", async (c) => {
  const u = requireAuth(c);
  const schema = z.object({ name: z.string().min(2).max(120), slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/).optional(), description: z.string().max(2000).optional(), categoryId: z.string().uuid().optional(), currency: z.string().length(3).optional() });
  const body = schema.safeParse(await c.req.json().catch(()=>null));
  if (!body.success) return fail(c, "VALIDATION_ERROR", "Please check your business details.", 422);
  const db = getDb(c.env);
  let slug = body.data.slug || slugify(body.data.name);
  const exists = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.slug, slug)).limit(1);
  if (exists[0]) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  const [biz] = await db.insert(businesses).values({ ownerId: u.id, name: body.data.name, slug, description: body.data.description || null, categoryId: body.data.categoryId || null, currency: body.data.currency || "USD" }).returning();
  await db.insert(businessMemberships).values({ businessId: biz.id, userId: u.id, role: "owner", status: "active" });
  await db.insert(businessSettings).values({ businessId: biz.id }).onConflictDoNothing();
  return ok(c, biz, undefined, 201);
});
businessesRoute.get("/mine", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env);
  const rows = await db.select({ business: businesses, role: businessMemberships.role }).from(businessMemberships).innerJoin(businesses, eq(businessMemberships.businessId, businesses.id)).where(and(eq(businessMemberships.userId, u.id), eq(businessMemberships.status,"active")));
  return ok(c, rows.map((r:any)=>({ ...r.business, myRole: r.role })));
});
businessesRoute.get("/:businessId", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env); const id = c.req.param("businessId");
  const m = await getMembership(db, id, u.id); if (!m) return fail(c, "FORBIDDEN", "Access denied.", 403);
  const [biz] = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
  if (!biz) return fail(c, "NOT_FOUND", "Business not found.", 404);
  return ok(c, { ...biz, myRole: m.role });
});
businessesRoute.patch("/:businessId", async (c) => {
  const u = requireAuth(c); const db = getDb(c.env); const id = c.req.param("businessId");
  const m = await getMembership(db, id, u.id); if (!canManage(m?.role)) return fail(c, "FORBIDDEN", "Access denied.", 403);
  const allowed = z.object({ name: z.string().min(2).max(120).optional(), description: z.string().max(2000).nullable().optional(), email: z.string().email().nullable().optional(), phone: z.string().max(40).nullable().optional(), website: z.string().url().nullable().optional(), address: z.string().max(255).nullable().optional(), city: z.string().max(120).nullable().optional(), region: z.string().max(120).nullable().optional(), country: z.string().max(120).nullable().optional(), timezone: z.string().max(60).optional(), currency: z.string().length(3).optional(), logoUrl: z.string().nullable().optional(), coverUrl: z.string().nullable().optional(), categoryId: z.string().uuid().nullable().optional() }).safeParse(await c.req.json().catch(()=>null));
  if (!allowed.success) return fail(c, "VALIDATION_ERROR", "Invalid fields.", 422);
  const [biz] = await db.update(businesses).set({ ...allowed.data, updatedAt: new Date() } as any).where(eq(businesses.id, id)).returning();
  return ok(c, biz);
});
async function setPub(c:any, publish:boolean){ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const [cur]=await db.select().from(businesses).where(eq(businesses.id,id)).limit(1); if(!cur) return fail(c,"NOT_FOUND","Not found.",404); const [biz]=await db.update(businesses).set({ status: publish?"published":"draft", publishedAt: publish?(cur.publishedAt||new Date()):cur.publishedAt, updatedAt:new Date() }).where(eq(businesses.id,id)).returning(); return ok(c,biz); }
businessesRoute.post("/:businessId/publish", c=>setPub(c,true));
businessesRoute.post("/:businessId/unpublish", c=>setPub(c,false));
businessesRoute.get("/:businessId/public-preview", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const m=await getMembership(db,c.req.param("businessId"),u.id); if(!m) return fail(c,"FORBIDDEN","Access denied.",403); const [biz]=await db.select().from(businesses).where(eq(businesses.id,c.req.param("businessId"))).limit(1); return ok(c,biz); });
businessesRoute.post("/:businessId/claim", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const {evidence}=(await c.req.json().catch(()=>({}))) as any; const [biz]=await db.select().from(businesses).where(eq(businesses.id,c.req.param("businessId"))).limit(1); if(!biz) return fail(c,"NOT_FOUND","Not found.",404); const [row]=await db.insert(businessClaims).values({ businessId: biz.id, claimantId:u.id, businessName:biz.name, evidence:evidence||{} }).returning(); return ok(c,row,undefined,201); });
businessesRoute.get("/:businessId/claims", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const m=await getMembership(db,c.req.param("businessId"),u.id); if(!canManage(m?.role)&&!u.isPlatformAdmin) return fail(c,"FORBIDDEN","Access denied.",403); return ok(c, await db.select().from(businessClaims).where(eq(businessClaims.businessId,c.req.param("businessId")))); });
businessesRoute.get("/:businessId/members", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(!m) return fail(c,"FORBIDDEN","Access denied.",403); const {users}=await import("../../db/schema"); return ok(c, await db.select({id:businessMemberships.id,userId:businessMemberships.userId,role:businessMemberships.role,status:businessMemberships.status,name:users.name,email:users.email}).from(businessMemberships).innerJoin(users,eq(businessMemberships.userId,users.id)).where(eq(businessMemberships.businessId,id))); });
businessesRoute.post("/:businessId/invitations", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.object({email:z.string().email(),role:z.enum(["manager","staff"]).default("staff")}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid invitation.",422); const token=randomToken(32); const [row]=await db.insert(businessInvitations).values({businessId:id,email:b.data.email.toLowerCase(),role:b.data.role,tokenHash:await sha256(token),invitedBy:u.id,expiresAt:new Date(Date.now()+7*86400000)}).returning(); return ok(c,{id:row.id,email:row.email,role:row.role,status:row.status,delivery:c.env.EMAIL_PROVIDER?"sent":"not_configured"},undefined,201); });
businessesRoute.delete("/:businessId/members/:userId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const target=c.req.param("userId"); const m=await getMembership(db,id,u.id); if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const [biz]=await db.select().from(businesses).where(eq(businesses.id,id)).limit(1); if(biz?.ownerId===target) return fail(c,"INVALID_REQUEST","Owner cannot be removed.",400); await db.delete(businessMemberships).where(and(eq(businessMemberships.businessId,id),eq(businessMemberships.userId,target))); return ok(c,{removed:true}); });
businessesRoute.patch("/:businessId/members/:userId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(m?.role!=="owner") return fail(c,"FORBIDDEN","Only owners can change roles.",403); const {role}=z.object({role:z.enum(["manager","staff"])}).parse(await c.req.json().catch(()=>({}))); await db.update(businessMemberships).set({role,updatedAt:new Date()}).where(and(eq(businessMemberships.businessId,id),eq(businessMemberships.userId,c.req.param("userId")))); return ok(c,{updated:true}); });
businessesRoute.get("/:businessId/settings", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const m=await getMembership(db,c.req.param("businessId"),u.id); if(!m) return fail(c,"FORBIDDEN","Access denied.",403); const [s]=await db.select().from(businessSettings).where(eq(businessSettings.businessId,c.req.param("businessId"))).limit(1); return ok(c,s||null); });
businessesRoute.patch("/:businessId/settings", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.object({bookingEnabled:z.boolean().optional(),orderingEnabled:z.boolean().optional(),messagingEnabled:z.boolean().optional(),reviewsEnabled:z.boolean().optional(),privacy:z.record(z.unknown()).optional(),notifications:z.record(z.unknown()).optional()}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid settings.",422); const [s]=await db.insert(businessSettings).values({businessId:id,...b.data,updatedAt:new Date()} as any).onConflictDoUpdate({target:businessSettings.businessId,set:{...b.data,updatedAt:new Date()} as any}).returning(); return ok(c,s); });
businessesRoute.get("/:businessId/hours", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const m=await getMembership(db,c.req.param("businessId"),u.id); if(!m) return fail(c,"FORBIDDEN","Access denied.",403); return ok(c, await db.select().from(businessHours).where(eq(businessHours.businessId,c.req.param("businessId"))).orderBy(businessHours.dayOfWeek)); });
businessesRoute.put("/:businessId/hours", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const id=c.req.param("businessId"); const m=await getMembership(db,id,u.id); if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.array(z.object({dayOfWeek:z.number().int().min(0).max(6),openTime:z.string().nullable().optional(),closeTime:z.string().nullable().optional(),isClosed:z.boolean().default(false)})).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid hours.",422); await db.delete(businessHours).where(eq(businessHours.businessId,id)); if(b.data.length) await db.insert(businessHours).values(b.data.map(h=>({businessId:id,...h}))); return ok(c, await db.select().from(businessHours).where(eq(businessHours.businessId,id))); });
businessesRoute.post("/:businessId/follow", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const {follows}=await import("../../db/schema"); const [biz]=await db.select({id:businesses.id}).from(businesses).where(and(eq(businesses.id,c.req.param("businessId")),eq(businesses.status,"published"))).limit(1); if(!biz) return fail(c,"NOT_FOUND","Not found.",404); await db.insert(follows).values({followerId:u.id,businessId:biz.id}).onConflictDoNothing(); return ok(c,{following:true}); });
businessesRoute.delete("/:businessId/follow", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const {follows}=await import("../../db/schema"); await db.delete(follows).where(and(eq(follows.followerId,u.id),eq(follows.businessId,c.req.param("businessId")))); return ok(c,{following:false}); });