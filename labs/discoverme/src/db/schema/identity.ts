import { pgTable, text, timestamp, boolean, uuid, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPlatformAdmin: boolean("is_platform_admin").notNull().default(false),
  platformRole: text("platform_role").default("user"), // user, moderator, admin
  status: text("status").notNull().default("active"), // active, restricted, deleted
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("users_email_idx").on(t.email)]);

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  locale: text("locale").default("en"),
  timezone: text("timezone").default("UTC"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("sessions_user_idx").on(t.userId), index("sessions_token_idx").on(t.tokenHash)]);

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("evt_user_idx").on(t.userId)]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("prt_user_idx").on(t.userId)]);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  interests: jsonb("interests").$type<string[]>().default([]),
  discoveryLocation: text("discovery_location"),
  theme: text("theme").default("light"),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userBlocks = pgTable("user_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockerId: uuid("blocker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blockedId: uuid("blocked_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("user_blocks_unique").on(t.blockerId, t.blockedId)]);

export const accountDeletionRequests = pgTable("account_deletion_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  status: text("status").notNull().default("requested"), // requested, processing, completed, cancelled
  reason: text("reason"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const dataExportRequests = pgTable("data_export_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("requested"), // requested, processing, ready, failed
  downloadUrl: text("download_url"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (t) => [index("der_user_idx").on(t.userId)]);