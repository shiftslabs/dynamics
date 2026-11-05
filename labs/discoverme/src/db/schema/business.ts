import { pgTable, text, timestamp, boolean, uuid, jsonb, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./identity";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: uuid("parent_id"),
  status: text("status").notNull().default("published"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  postalCode: text("postal_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone").default("UTC"),
  currency: text("currency").notNull().default("USD"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  status: text("status").notNull().default("draft"), // draft, published, suspended, archived
  isVerified: boolean("is_verified").notNull().default(false),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (t) => [
  index("businesses_slug_idx").on(t.slug),
  index("businesses_owner_idx").on(t.ownerId),
  index("businesses_status_idx").on(t.status),
  index("businesses_category_idx").on(t.categoryId),
  index("businesses_city_idx").on(t.city),
]);

export const businessMemberships = pgTable("business_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("staff"), // owner, manager, staff
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("biz_member_unique").on(t.businessId, t.userId), index("biz_member_user_idx").on(t.userId)]);

export const businessInvitations = pgTable("business_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("staff"),
  tokenHash: text("token_hash").notNull().unique(),
  invitedBy: uuid("invited_by").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, expired
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("biz_inv_business_idx").on(t.businessId)]);

export const businessServiceAreas = pgTable("business_service_areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  radiusKm: integer("radius_km"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("bsa_business_idx").on(t.businessId)]);

export const businessHours = pgTable("business_hours", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6
  openTime: text("open_time"), // HH:mm
  closeTime: text("close_time"),
  isClosed: boolean("is_closed").notNull().default(false),
}, (t) => [index("bh_business_idx").on(t.businessId), uniqueIndex("bh_day_unique").on(t.businessId, t.dayOfWeek)]);

export const businessSpecialHours = pgTable("business_special_hours", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isClosed: boolean("is_closed").notNull().default(false),
  note: text("note"),
}, (t) => [index("bsh_business_idx").on(t.businessId)]);

export const businessClaims = pgTable("business_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "set null" }),
  claimantId: uuid("claimant_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  evidence: jsonb("evidence").$type<Record<string, unknown>>().default({}),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewerId: uuid("reviewer_id").references(() => users.id),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
}, (t) => [index("claims_status_idx").on(t.status)]);

export const businessVerificationRecords = pgTable("business_verification_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
}, (t) => [index("bvr_business_idx").on(t.businessId)]);

export const businessSettings = pgTable("business_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }).unique(),
  bookingEnabled: boolean("booking_enabled").notNull().default(false),
  orderingEnabled: boolean("ordering_enabled").notNull().default(false),
  messagingEnabled: boolean("messaging_enabled").notNull().default(true),
  reviewsEnabled: boolean("reviews_enabled").notNull().default(true),
  privacy: jsonb("privacy").$type<Record<string, unknown>>().default({}),
  notifications: jsonb("notifications").$type<Record<string, unknown>>().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const businessLinks = pgTable("business_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  url: text("url").notNull(),
  type: text("type").default("website"),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("bl_business_idx").on(t.businessId)]);