import { pgTable, text, timestamp, uuid, integer, index, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "set null" }),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  visibility: text("visibility").notNull().default("public"), // public, private, restricted
  joinPolicy: text("join_policy").notNull().default("open"), // open, approval, invite
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("comm_slug_idx").on(t.slug), index("comm_business_idx").on(t.businessId)]);

export const communityMemberships = pgTable("community_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // owner, moderator, member
  status: text("status").notNull().default("active"), // active, pending, banned, left
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("cm_unique").on(t.communityId, t.userId), index("cm_user_idx").on(t.userId)]);

export const communityInvitations = pgTable("community_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  invitedUserId: uuid("invited_user_id").references(() => users.id),
  email: text("email"),
  tokenHash: text("token_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (t) => [index("ci_comm_idx").on(t.communityId)]);

export const communityRules = pgTable("community_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const communityPosts = pgTable("community_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  title: text("title"),
  body: text("body").notNull(),
  status: text("status").notNull().default("active"), // active, removed, pending
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("cp_comm_idx").on(t.communityId), index("cp_created_idx").on(t.createdAt)]);

export const communityPostComments = pgTable("community_post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("cpc_post_idx").on(t.postId)]);

export const communityReactions = pgTable("community_reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("like"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("cr_unique").on(t.postId, t.userId, t.type)]);

export const communityTags = pgTable("community_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
}, (t) => [index("ct_comm_idx").on(t.communityId)]);

export const communityPostTags = pgTable("community_post_tags", {
  postId: uuid("post_id").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => communityTags.id, { onDelete: "cascade" }),
}, (t) => [uniqueIndex("cpt_unique").on(t.postId, t.tagId)]);

export const communityModerationEvents = pgTable("community_moderation_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id").references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id"),
  action: text("action").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("cme_comm_idx").on(t.communityId)]);

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, closed
  allowMultiple: boolean("allow_multiple").notNull().default(false),
  closesAt: timestamp("closes_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("polls_comm_idx").on(t.communityId)]);

export const pollOptions = pgTable("poll_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("po_poll_idx").on(t.pollId)]);

export const pollVotes = pgTable("poll_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  optionId: uuid("option_id").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("pv_unique").on(t.pollId, t.optionId, t.userId), index("pv_poll_idx").on(t.pollId)]);