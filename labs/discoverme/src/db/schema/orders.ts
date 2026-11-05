import { pgTable, text, timestamp, uuid, integer, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";
import { products } from "./catalog";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, preparing, dispatched, completed, cancelled
  subtotalMinor: integer("subtotal_minor").notNull().default(0),
  totalMinor: integer("total_minor").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  notes: text("notes"),
  idempotencyKey: text("idempotency_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("orders_business_idx").on(t.businessId), index("orders_customer_idx").on(t.customerId), index("orders_status_idx").on(t.status)]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id"),
  nameSnapshot: text("name_snapshot").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPriceMinor: integer("unit_price_minor").notNull(),
  totalMinor: integer("total_minor").notNull(),
  currency: text("currency").notNull().default("USD"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
}, (t) => [index("oi_order_idx").on(t.orderId)]);

export const orderStatusEvents = pgTable("order_status_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  actorId: uuid("actor_id").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ose_order_idx").on(t.orderId)]);

export const paymentRecords = pgTable("payment_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  bookingId: uuid("booking_id"),
  provider: text("provider"),
  providerRef: text("provider_ref"),
  status: text("status").notNull().default("pending"), // pending, authorized, captured, failed, refunded
  amountMinor: integer("amount_minor").notNull(),
  currency: text("currency").notNull().default("USD"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("pr_order_idx").on(t.orderId)]);

export const refundRecords = pgTable("refund_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").notNull().references(() => paymentRecords.id, { onDelete: "cascade" }),
  amountMinor: integer("amount_minor").notNull(),
  currency: text("currency").notNull().default("USD"),
  reason: text("reason"),
  status: text("status").notNull().default("pending"),
  providerRef: text("provider_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("rr_payment_idx").on(t.paymentId)]);