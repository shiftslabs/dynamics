import { pgTable, text, timestamp, uuid, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(), // user, business, post, review, community, message, comment
  targetId: uuid("target_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").notNull().default("open"), // open, investigating, resolved, dismissed, escalated
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("reports_status_idx").on(t.status), index("reports_target_idx").on(t.targetType, t.targetId)]);

export const moderationActions = pgTable("moderation_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").references(() => reports.id, { onDelete: "set null" }),
  actorId: uuid("actor_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  action: text("action").notNull(), // warn, remove, hide, restrict, ban, restore, dismiss
  reason: text("reason"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ma_target_idx").on(t.targetType, t.targetId)]);

export const moderationAppeals = pgTable("moderation_appeals", {
  id: uuid("id").primaryKey().defaultRandom(),
  actionId: uuid("action_id").references(() => moderationActions.id, { onDelete: "set null" }),
  reportId: uuid("report_id").references(() => reports.id, { onDelete: "set null" }),
  appellantId: uuid("appellant_id").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  reviewerId: uuid("reviewer_id").references(() => users.id),
  decision: text("decision"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
}, (t) => [index("appeals_status_idx").on(t.status)]);

export const adminAuditEvents = pgTable("admin_audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: uuid("target_id"),
  ipHash: text("ip_hash"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("aae_actor_idx").on(t.actorId), index("aae_created_idx").on(t.createdAt)]);

export const platformSettings = pgTable("platform_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>(),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});