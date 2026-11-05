import { pgTable, text, timestamp, uuid, integer, index, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  title: text("title"),
  body: text("body").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, archived, removed
  visibility: text("visibility").notNull().default("public"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (t) => [index("posts_business_idx").on(t.businessId), index("posts_status_idx").on(t.status), index("posts_published_idx").on(t.publishedAt)]);

export const postMedia = pgTable("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  mediaId: uuid("media_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("post_media_post_idx").on(t.postId)]);

export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("pc_post_idx").on(t.postId)]);

export const postReactions = pgTable("post_reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("like"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("pr_unique").on(t.postId, t.userId, t.type), index("pr_post_idx").on(t.postId)]);

export const postBookmarks = pgTable("post_bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("pb_unique").on(t.postId, t.userId)]);

export const postReports = pgTable("post_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  reporterId: uuid("reporter_id").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("post_reports_status_idx").on(t.status)]);

export const follows = pgTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("follows_unique").on(t.followerId, t.businessId), index("follows_business_idx").on(t.businessId)]);

export const savedBusinesses = pgTable("saved_businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("saved_biz_unique").on(t.userId, t.businessId)]);