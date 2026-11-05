import { Hono } from "hono";
import { z } from "zod";
import { eq, and, inArray } from "drizzle-orm";
import type { Env } from "../../lib/env";
import { getDb } from "../../db/client";
import { orders, orderItems, orderStatusEvents, products, productVariants, businessMemberships } from "../../db/schema";
import { ok, fail, requireAuth, getPagination } from "../../lib/http";
export const ordersRoute = new Hono<{ Bindings: Env }>();
export { ordersRoute as orders };
async function bm(db:any,bid:string,uid:string){ const [m]=await db.select().from(businessMemberships).where(and(eq(businessMemberships.businessId,bid),eq(businessMemberships.userId,uid),eq(businessMemberships.status,"active"))).limit(1); return m; }
const canManage=(r?:string)=>r==="owner"||r==="manager"||r==="staff";

ordersRoute.post("/orders", async (c)=>{
  const u=requireAuth(c); const db=getDb(c.env);
  const b=z.object({ businessId:z.string().uuid(), items:z.array(z.object({productId:z.string().uuid(),variantId:z.string().uuid().optional(),quantity:z.number().int().min(1).max(100)})).min(1), notes:z.string().max(1000).optional(), idempotencyKey:z.string().max(120).optional() }).safeParse(await c.req.json().catch(()=>null));
  if(!b.success) return fail(c,"VALIDATION_ERROR","Invalid order.",422);
  if (b.data.idempotencyKey) { const [ex]=await db.select().from(orders).where(and(eq(orders.customerId,u.id),eq(orders.idempotencyKey,b.data.idempotencyKey))).limit(1); if(ex){ const items=await db.select().from(orderItems).where(eq(orderItems.orderId,ex.id)); return ok(c,{...ex,items}); } }
  const pids=[...new Set(b.data.items.map(i=>i.productId))];
  const prows=await db.select().from(products).where(and(inArray(products.id,pids as any), eq(products.businessId,b.data.businessId), eq(products.status,"published")));
  const pmap=new Map(prows.map(p=>[p.id,p]));
  let subtotal=0; const lines:any[]=[];
  for (const it of b.data.items){ const p=pmap.get(it.productId); if(!p) return fail(c,"VALIDATION_ERROR","One or more items are unavailable.",422); if(p.inventoryCount!==null && p.inventoryCount < it.quantity) return fail(c,"CONFLICT","Insufficient inventory for one or more items.",409); const total=p.priceMinor*it.quantity; subtotal+=total; lines.push({productId:p.id,variantId:it.variantId||null,nameSnapshot:p.name,quantity:it.quantity,unitPriceMinor:p.priceMinor,totalMinor:total,currency:p.currency}); }
  const [order]=await db.insert(orders).values({businessId:b.data.businessId,customerId:u.id,status:"pending",subtotalMinor:subtotal,totalMinor:subtotal,currency:lines[0].currency||"USD",notes:b.data.notes||null,idempotencyKey:b.data.idempotencyKey||null}).returning();
  await db.insert(orderItems).values(lines.map(l=>({orderId:order.id,...l})));
  await db.insert(orderStatusEvents).values({orderId:order.id,toStatus:"pending",actorId:u.id});
  return ok(c,{...order,items:lines},undefined,201);
});
ordersRoute.get("/orders", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const {limit,offset}=getPagination(c); return ok(c, await db.select().from(orders).where(eq(orders.customerId,u.id)).orderBy(orders.createdAt).limit(limit).offset(offset), {limit,offset}); });
ordersRoute.get("/orders/:orderId", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(orders).where(eq(orders.id,c.req.param("orderId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); const m=await bm(db,row.businessId,u.id); if(row.customerId!==u.id && !m) return fail(c,"FORBIDDEN","Access denied.",403); const items=await db.select().from(orderItems).where(eq(orderItems.orderId,row.id)); return ok(c,{...row,items}); });
ordersRoute.get("/businesses/:businessId/orders", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const bid=c.req.param("businessId"); if(!await bm(db,bid,u.id)) return fail(c,"FORBIDDEN","Access denied.",403); const {limit,offset}=getPagination(c); return ok(c, await db.select().from(orders).where(eq(orders.businessId,bid)).orderBy(orders.createdAt).limit(limit).offset(offset), {limit,offset}); });
async function trans(c:any,to:string,from:string[],managerOnly=false){ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(orders).where(eq(orders.id,c.req.param("orderId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); const m=await bm(db,row.businessId,u.id); if(managerOnly){ if(!canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); } else if(row.customerId!==u.id && !canManage(m?.role)) return fail(c,"FORBIDDEN","Access denied.",403); if(!from.includes(row.status)) return fail(c,"INVALID_STATE","This order cannot be updated now.",409); const [out]=await db.update(orders).set({status:to,updatedAt:new Date()}).where(eq(orders.id,row.id)).returning(); await db.insert(orderStatusEvents).values({orderId:row.id,fromStatus:row.status,toStatus:to,actorId:u.id}); return ok(c,out); }
ordersRoute.post("/orders/:orderId/accept", c=>trans(c,"accepted",["pending"],true));
ordersRoute.post("/orders/:orderId/decline", c=>trans(c,"declined",["pending"],true));
ordersRoute.post("/orders/:orderId/prepare", c=>trans(c,"preparing",["accepted"],true));
ordersRoute.post("/orders/:orderId/dispatch", c=>trans(c,"dispatched",["preparing"],true));
ordersRoute.post("/orders/:orderId/complete", c=>trans(c,"completed",["dispatched","accepted","preparing"],true));
ordersRoute.post("/orders/:orderId/cancel", c=>trans(c,"cancelled",["pending","accepted"],false));
ordersRoute.get("/orders/:orderId/events", async (c)=>{ const u=requireAuth(c); const db=getDb(c.env); const [row]=await db.select().from(orders).where(eq(orders.id,c.req.param("orderId"))).limit(1); if(!row) return fail(c,"NOT_FOUND","Not found.",404); const m=await bm(db,row.businessId,u.id); if(row.customerId!==u.id&&!m) return fail(c,"FORBIDDEN","Access denied.",403); return ok(c, await db.select().from(orderStatusEvents).where(eq(orderStatusEvents.orderId,row.id))); });