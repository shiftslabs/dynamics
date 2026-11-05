import { Hono } from "hono";
import { z } from "zod";
import { eq, and, lt, gt, ne, inArray } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { bookings, bookingStatusEvents, bookingRules, bookingAvailability, bookingBlockedPeriods, services, businesses, businessMemberships } from "../../db/schema";
import { ok, fail, requireAuth, getPagination } from "../../lib/http";
export const bookingsRoute = new Hono<{ Bindings: Env }>();
export { bookingsRoute as bookings };
async function bizMember(db:any,bid:string,uid:string){ const [m]=await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId,bid),eq(businessMemberships.userId,uid),eq(businessMemberships.status,"active"))).limit(1); return m; }
const canManage=(r?:string)=>r==="owner"||r==="manager"||r==="staff";

bookingsRoute.get("/services/:serviceId/availability", async (c)=>{ const db=getDb(c.env); const sid=c.req.param("serviceId"); const [svc]=await db.select().from(services).where(eq(services.id,sid)).limit(1); if(!svc||svc.status!=="published") return fail(c,"NOT_FOUND","Service not found.",404); const slots=await db.select().from(bookingAvailability).where(and(eq(bookingAvailability.businessId,svc.businessId),eq(bookingAvailability.isActive,true))); const blocked=await db.select().from(bookingBlockedPeriods).where(eq(bookingBlockedPeriods.businessId,svc.businessId)); return ok(c,{ serviceId:sid, durationMinutes: svc.durationMinutes||60, availability: slots, blockedPeriods: blocked }); });
bookingsRoute.get("/businesses/:businessId/availability", async (c)=>{ const db=getDb(c.env); return ok(c, await db.select().from(bookingAvailability).where(eq(bookingAvailability.businessId,c.req.param("businessId")))); });
bookingsRoute.put("/businesses/:businessId/availability-rules", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId"); if(!canManage((await bizMember(db,bid,u.id))?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.object({minNoticeMinutes:z.number().int().min(0).optional(),maxAdvanceDays:z.number().int().min(1).max(365).optional(),bufferMinutes:z.number().int().min(0).optional(),cancellationPolicy:z.string().max(2000).nullable().optional(),autoConfirm:z.boolean().optional(),timezone:z.string().max(60).optional()}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid rules.",422); const [row]=await db.insert(bookingRules).values({businessId:bid,...b.data,updatedAt:new Date()} as any).onConflictDoUpdate({target:bookingRules.businessId,set:{...b.data,updatedAt:new Date()} as any}).returning(); return ok(c,row); });
bookingsRoute.post("/businesses/:businessId/blocked-periods", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId"); if(!canManage((await bizMember(db,bid,u.id))?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.object({startsAt:z.string().datetime(),endsAt:z.string().datetime(),reason:z.string().max(255).optional()}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid period.",422); const [row]=await db.insert(bookingBlockedPeriods).values({businessId:bid,startsAt:new Date(b.data.startsAt),endsAt:new Date(b.data.endsAt),reason:b.data.reason||null}).returning(); return ok(c,row,undefined,201); });
bookingsRoute.delete("/businesses/:businessId/blocked-periods/:periodId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId"); if(!canManage((await bizMember(db,bid,u.id))?.role)) return fail(c,"FORBIDDEN","Access denied.",403); await db.delete(bookingBlockedPeriods).where(and(eq(bookingBlockedPeriods.id,c.req.param("periodId")),eq(bookingBlockedPeriods.businessId,bid))); return ok(c,{deleted:true}); });

bookingsRoute.post("/bookings", async (c)=>{
  const u=requireAuth(c); const db=getDb(c.env);
  const b=z.object({serviceId:z.string().uuid(),startsAt:z.string().datetime(),notes:z.string().max(1000).optional(),idempotencyKey:z.string().max(120).optional()}).safeParse(await c.req.json().catch(()=>null));
  if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid booking request.",422);
  const [svc]=await db.select().from(services).where(eq(services.id,b.data.serviceId)).limit(1);
  if(!svc||svc.status!=="published") return fail(c,"NOT_FOUND","Service not found.",404);
  if (b.data.idempotencyKey) { const [ex]=await db.select().from(bookings).where(and(eq(bookings.customerId,u.id),eq(bookings.idempotencyKey,b.data.idempotencyKey))).limit(1); if(ex) return ok(c,ex); }
  const starts=new Date(b.data.startsAt); const ends=new Date(starts.getTime()+(svc.durationMinutes||60)*60000);
  if (starts.getTime() < Date.now()+5*60000) return fail(c,"VALIDATION_ERROR","Booking time must be in the future.",422);
  // conflict check
  const conflicts = await db.select({id:bookings.id}).from(bookings).where(and(eq(bookings.businessId,svc.businessId), inArray(bookings.status,["requested","confirmed"] as any), lt(bookings.startsAt, ends), gt(bookings.endsAt, starts))).limit(1);
  if (conflicts[0]) return fail(c,"CONFLICT","That time is no longer available.",409);
  const [rules]=await db.select().from(bookingRules).where(eq(bookingRules.businessId,svc.businessId)).limit(1);
  const status = rules?.autoConfirm ? "confirmed" : "requested";
  const [row]=await db.insert(bookings).values({businessId:svc.businessId,serviceId:svc.id,customerId:u.id,status,startsAt:starts,endsAt:ends,notes:b.data.notes||null,priceMinor:svc.priceMinor,currency:svc.currency,idempotencyKey:b.data.idempotencyKey||null,timezone:rules?.timezone||"UTC"}).returning();
  await db.insert(bookingStatusEvents).values({bookingId:row.id,toStatus:status,actorId:u.id});
  return ok(c,row,undefined,201);
});

bookingsRoute.get("/bookings", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const {limit,offset}=getPagination(c); return ok(c, await db.select().from(bookings).where(eq(bookings.customerId,u.id)).orderBy(bookings.startsAt).limit(limit).offset(offset), {limit,offset}); });
bookingsRoute.get("/bookings/:bookingId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(bookings).where(eq(bookings.id,c.req.param("bookingId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); const m=await bizMember(db,row.businessId,u.id); if(row.customerId!==u.id && !m) return fail(c,"FORBIDDEN","Access denied.",403); return ok(c,row); });

async function transitionBooking(c:any, to:string, allowedFrom:string[], managerOnly=false){
  const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(bookings).where(eq(bookings.id,c.req.param("bookingId"))).limit(1);
  if(!row) return fail(c,"NOT_FOUND","Not found.",404);
  const m=await bizMember(db,row.businessId,u.id);
  if(managerOnly){ if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); }
  else { if(row.customerId!==u.id && !canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); }
  if(!allowedFrom.includes(row.status)) return fail(c,"INVALID_STATE","This booking cannot be updated right now.",409);
  if(to==="cancelled" && row.customerId===u.id && !canManage(m?.role) && row.startsAt.getTime()-Date.now() < 2*3600000) return fail(c,"INVALID_STATE","This booking can no longer be cancelled online.",409);
  const [out]=await db.update(bookings).set({status:to,updatedAt:new Date()}).where(eq(bookings.id,row.id)).returning();
  await db.insert(bookingStatusEvents).values({bookingId:row.id,fromStatus:row.status,toStatus:to,actorId:u.id});
  return ok(c,out);
}
bookingsRoute.post("/bookings/:bookingId/confirm", c=>transitionBooking(c,"confirmed",["requested"],true));
bookingsRoute.post("/bookings/:bookingId/decline", c=>transitionBooking(c,"declined",["requested"],true));
bookingsRoute.post("/bookings/:bookingId/cancel", c=>transitionBooking(c,"cancelled",["requested","confirmed"],false));
bookingsRoute.post("/bookings/:bookingId/complete", c=>transitionBooking(c,"completed",["confirmed"],true));
bookingsRoute.get("/businesses/:businessId/bookings", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId"); if(!await bizMember(db,bid,u.id)) return fail(c,"FORBIDDEN","Access denied.",403); const {limit,offset}=getPagination(c); return ok(c, await db.select().from(bookings).where(eq(bookings.businessId,bid)).orderBy(bookings.startsAt).limit(limit).offset(offset), {limit,offset}); });