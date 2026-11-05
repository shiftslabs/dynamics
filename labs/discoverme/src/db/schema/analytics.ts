import { pgTable, text, timestamp, uuid, integer, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "set null" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  eventType: text("event_type").notNull(),
  resourceType: text("resource_type"),
  resourceId: uuid("resource_id"),
  sessionKey: text("session_key"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ae_business_idx").on(t.businessId), index("ae_type_idx").on(t.eventType), index("ae_created_idx").on(t.createdAt)]);

export const searchEvents = pgTable("search_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  query: text("query").notNull(),
  filters: jsonb("filters").$type<Record<string, unknown>>().default({}),
  resultCount: integer("result_count"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("se_created_idx").on(t.createdAt)]);

export const businessDailyMetrics = pgTable("business_daily_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  profileViews: integer("profile_views").notNull().default(0),
  follows: integer("follows").notNull().default(0),
  messages: integer("messages").notNull().default(0),
  bookings: integer("bookings").notNull().default(0),
  orders: integer("orders").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
}, (t) => [index("bdm_biz_date_idx").on(t.businessId, t.date)]);