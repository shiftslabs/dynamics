import { pgTable, text, timestamp, uuid, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("direct"), // direct, support
  status: text("status").notNull().default("active"),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("conv_business_idx").on(t.businessId), index("conv_last_idx").on(t.lastMessageAt)]);

export const conversationParticipants = pgTable("conversation_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // member, staff
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }),
}, (t) => [uniqueIndex("cp_unique").on(t.conversationId, t.userId), index("cp_user_idx").on(t.userId)]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  status: text("status").notNull().default("sent"), // sent, delivered, failed
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("msg_conv_idx").on(t.conversationId), index("msg_created_idx").on(t.createdAt)]);

export const messageAttachments = pgTable("message_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  mediaId: uuid("media_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ma_msg_idx").on(t.messageId)]);

export const messageReadReceipts = pgTable("message_read_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("mrr_unique").on(t.messageId, t.userId)]);

export const conversationAssignments = pgTable("conversation_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").notNull().references(() => users.id),
  assignedBy: uuid("assigned_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ca_conv_idx").on(t.conversationId)]);