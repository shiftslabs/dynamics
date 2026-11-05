import { Hono } from "hono";
import { z } from "zod";
import { eq, and, avg, count, desc } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { reviews, reviewResponses, reviewReports, businessMemberships, businesses, bookings, orders } from "../../db/schema";
import { ok, fail, requireAuth, getPagination } from "../../lib/http";
export const reviewsRoute = new Hono<{ Bindings: Env }>();
export { reviewsRoute as reviews };
async function bm(db:any,bid:string,uid:string){ const [m]=await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId,bid),eq(businessMemberships.userId,uid),eq(businessMemberships.status,"active"))).limit(1); return m; }
const canManage=(r?:string)=>r==="owner"||r==="manager";

reviewsRoute.get("/businesses/:businessId/reviews", async (c)=>{ const db=getDb(c.env); const {limit,offset}=getPagination(c); const rows=await db.select().from(reviews).where(and(eq(reviews.businessId,c.req.param("businessId")), eq(reviews.status,"published"))).orderBy(desc(reviews.createdAt)).limit(limit).offset(offset); return ok(c, rows, {limit,offset}); });
reviewsRoute.post("/businesses/:businessId/reviews", async (c)=>{
  const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId");
  const b=z.object({rating:z.number().int().min(1).max(5),title:z.string().max(120).optional(),body:z.string().max(4000).optional(),bookingId:z.string().uuid().optional(),orderId:z.string().uuid().optional()}).safeParse(await c.req.json().catch(()=>null));
  if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid review.",422);
  const [biz]=await db.select({id:businesses.id}).from(businesses).where(and(eq(businesses.id,bid),eq(businesses.status,"published"))).limit(1);
  if(!biz) return fail(c,"NOT_FOUND","Business not found.",404);
  const [dup]=await db.select({id:reviews.id}).from(reviews).where(and(eq(reviews.businessId,bid),eq(reviews.authorId,u.id))).limit(1);
  if(dup) return fail(c,"CONFLICT","You have already reviewed this business.",409);
  let verified=false;
  if (b.data.bookingId){ const [bk]=await db.select({id:bookings.id}).from(bookings).where(and(eq(bookings.id,b.data.bookingId),eq(bookings.customerId,u.id),eq(bookings.businessId,bid),eq(bookings.status,"completed"))).limit(1); verified=!!bk; }
  if (!verified && b.data.orderId){ const [od]=await db.select({id:orders.id}).from(orders).where(and(eq(orders.id,b.data.orderId),eq(orders.customerId,u.id),eq(orders.businessId,bid),eq(orders.status,"completed"))).limit(1); verified=!!od; }
  const [row]=await db.insert(reviews).values({businessId:bid,authorId:u.id,rating:b.data.rating,title:b.data.title||null,body:b.data.body||null,bookingId:b.data.bookingId||null,orderId:b.data.orderId||null,isVerifiedInteraction:verified,status:"published"}).returning();
  return ok(c,row,undefined,201);
});
reviewsRoute.get("/reviews/:reviewId", async (c)=>{ const db=getDb(c.env); const [row]=await db.select().from(reviews).where(and(eq(reviews.id,c.req.param("reviewId")),eq(reviews.status,"published"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); const [resp]=await db.select().from(reviewResponses).where(eq(reviewResponses.reviewId,row.id)).limit(1); return ok(c,{...row,response:resp||null}); });
reviewsRoute.patch("/reviews/:reviewId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(reviews).where(eq(reviews.id,c.req.param("reviewId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); if(row.authorId!==u.id) return fail(c,"FORBIDDEN","Access denied.",403); const b=z.object({rating:z.number().int().min(1).max(5).optional(),title:z.string().max(120).nullable().optional(),body:z.string().max(4000).nullable().optional()}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid.",422); const [out]=await db.update(reviews).set({...b.data,updatedAt:new Date()}).where(eq(reviews.id,row.id)).returning(); return ok(c,out); });
reviewsRoute.delete("/reviews/:reviewId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(reviews).where(eq(reviews.id,c.req.param("reviewId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); if(row.authorId!==u.id) return fail(c,"FORBIDDEN","Access denied.",403); await db.update(reviews).set({status:"removed",updatedAt:new Date()}).where(eq(reviews.id,row.id)); return ok(c,{removed:true}); });
reviewsRoute.post("/reviews/:reviewId/respond", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(reviews).where(eq(reviews.id,c.req.param("reviewId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); if(!canManage((await bm(db,row.businessId,u.id))?.role)) return fail(c,"FORBIDDEN","Access denied.",403); const {body}=z.object({body:z.string().min(1).max(4000)}).parse(await c.req.json().catch(()=>({}))); const [ex]=await db.select().from(reviewResponses).where(eq(reviewResponses.reviewId,row.id)).limit(1); if(ex){ const [out]=await db.update(reviewResponses).set({body,updatedAt:new Date()}).where(eq(reviewResponses.id,ex.id)).returning(); return ok(c,out); } const [out]=await db.insert(reviewResponses).values({reviewId:row.id,businessId:row.businessId,responderId:u.id,body}).returning(); return ok(c,out,undefined,201); });
reviewsRoute.post("/reviews/:reviewId/report", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const b=z.object({reason:z.string().min(1).max(200),details:z.string().max(2000).optional()}).safeParse(await c.req.json().catch(()=>null)); if(!b.success) return fail(c,"VALIDATION_ERROR","Reason required.",422); const [row]=await db.insert(reviewReports).values({reviewId:c.req.param("reviewId"),reporterId:u.id,reason:b.data.reason,details:b.data.details||null}).returning(); return ok(c,{id:row.id,status:row.status},undefined,201); });
reviewsRoute.get("/businesses/:businessId/review-summary", async (c)=>{ const db=getDb(c.env); const bid=c.req.param("businessId"); const [agg]=await db.select({ avgRating: avg(reviews.rating), total: count() }).from(reviews).where(and(eq(reviews.businessId,bid),eq(reviews.status,"published"))); return ok(c,{ averageRating: agg?.avgRating ? Number(Number(agg.avgRating).toFixed(2)) : null, total: Number(agg?.total||0) }); });