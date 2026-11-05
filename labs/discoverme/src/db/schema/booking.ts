import { pgTable, text, timestamp, uuid, integer, index, boolean } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";
import { services } from "./catalog";

export const bookingRules = pgTable("booking_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }).unique(),
  minNoticeMinutes: integer("min_notice_minutes").notNull().default(60),
  maxAdvanceDays: integer("max_advance_days").notNull().default(60),
  bufferMinutes: integer("buffer_minutes").notNull().default(0),
  cancellationPolicy: text("cancellation_policy"),
  autoConfirm: boolean("auto_confirm").notNull().default(false),
  timezone: text("timezone").default("UTC"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookingAvailability = pgTable("booking_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6
  startTime: text("start_time").notNull(), // HH:mm
  endTime: text("end_time").notNull(),
  isActive: boolean("is_active").notNull().default(true),
}, (t) => [index("ba_business_idx").on(t.businessId)]);

export const bookingBlockedPeriods = pgTable("booking_blocked_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("bbp_business_idx").on(t.businessId)]);

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => services.id),
  customerId: uuid("customer_id").notNull().references(() => users.id),
  status: text("status").notNull().default("requested"), // requested, confirmed, declined, cancelled, completed
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  timezone: text("timezone").default("UTC"),
  notes: text("notes"),
  priceMinor: integer("price_minor").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  idempotencyKey: text("idempotency_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("bookings_business_idx").on(t.businessId), index("bookings_customer_idx").on(t.customerId), index("bookings_status_idx").on(t.status), index("bookings_starts_idx").on(t.startsAt)]);

export const bookingStatusEvents = pgTable("booking_status_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  actorId: uuid("actor_id").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("bse_booking_idx").on(t.bookingId)]);