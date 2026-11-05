import { pgTable, text, timestamp, uuid, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  linkUrl: text("link_url"),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
}, (t) => [index("notif_user_idx").on(t.userId), index("notif_read_idx").on(t.userId, t.isRead)]);

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  inApp: boolean("in_app").notNull().default(true),
  email: boolean("email").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  messages: boolean("messages").notNull().default(true),
  bookings: boolean("bookings").notNull().default(true),
  orders: boolean("orders").notNull().default(true),
  communities: boolean("communities").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notificationDeliveryAttempts = pgTable("notification_delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  notificationId: uuid("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
  channel: text("channel").notNull(), // in_app, email
  status: text("status").notNull().default("pending"),
  providerRef: text("provider_ref"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("nda_notif_idx").on(t.notificationId)]);