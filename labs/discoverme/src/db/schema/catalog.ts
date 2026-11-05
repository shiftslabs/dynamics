import { pgTable, text, timestamp, boolean, uuid, integer, index, jsonb } from "drizzle-orm/pg-core";
import { businesses } from "./business";
import { users } from "./identity";

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "set null" }),
  bucket: text("bucket"),
  objectKey: text("object_key").notNull(),
  url: text("url"),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
  purpose: text("purpose").default("general"), // logo, cover, product, service, post, message, community
  status: text("status").notNull().default("active"), // pending, active, deleted
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("media_owner_idx").on(t.ownerId), index("media_business_idx").on(t.businessId)]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  priceMinor: integer("price_minor").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"), // draft, published, archived
  inventoryCount: integer("inventory_count"),
  sku: text("sku"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (t) => [index("products_business_idx").on(t.businessId), index("products_status_idx").on(t.status), index("products_slug_idx").on(t.businessId, t.slug)]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku"),
  priceMinor: integer("price_minor"),
  currency: text("currency"),
  inventoryCount: integer("inventory_count"),
  attributes: jsonb("attributes").$type<Record<string, unknown>>().default({}),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("pv_product_idx").on(t.productId)]);

export const productMedia = pgTable("product_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  mediaId: uuid("media_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("pm_product_idx").on(t.productId)]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  priceMinor: integer("price_minor").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  durationMinutes: integer("duration_minutes").default(60),
  status: text("status").notNull().default("draft"),
  category: text("category"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (t) => [index("services_business_idx").on(t.businessId), index("services_status_idx").on(t.status), index("services_slug_idx").on(t.businessId, t.slug)]);

export const serviceCategories = pgTable("service_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("sc_business_idx").on(t.businessId)]);

export const serviceMedia = pgTable("service_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  mediaId: uuid("media_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("sm_service_idx").on(t.serviceId)]);