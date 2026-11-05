import { pgTable, text, timestamp, uuid, integer, index, uniqueIndex, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { businesses } from "./business";
import { bookings } from "./booking";
import { orders } from "./orders";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => users.id),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(), // 1-5
  title: text("title"),
  body: text("body"),
  status: text("status").notNull().default("published"), // published, pending, removed, hidden
  isVerifiedInteraction: boolean("is_verified_interaction").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("reviews_business_idx").on(t.businessId), index("reviews_author_idx").on(t.authorId), uniqueIndex("reviews_author_business_unique").on(t.authorId, t.businessId)]);

export const reviewResponses = pgTable("review_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }).unique(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  responderId: uuid("responder_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewReports = pgTable("review_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  reporterId: uuid("reporter_id").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("rr_status_idx").on(t.status)]);

export const reviewEligibilityRecords = pgTable("review_eligibility_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id").references(() => bookings.id),
  orderId: uuid("order_id").references(() => orders.id),
  eligibleAt: timestamp("eligible_at", { withTimezone: true }).notNull().defaultNow(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
}, (t) => [index("rer_biz_user_idx").on(t.businessId, t.userId)]);

export const surveys = pgTable("surveys", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft, published, closed, archived
  opensAt: timestamp("opens_at", { withTimezone: true }),
  closesAt: timestamp("closes_at", { withTimezone: true }),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("surveys_business_idx").on(t.businessId)]);

export const surveyQuestions = pgTable("survey_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  surveyId: uuid("survey_id").notNull().references(() => surveys.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // single_choice, multi_choice, text, rating
  prompt: text("prompt").notNull(),
  required: boolean("required").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("sq_survey_idx").on(t.surveyId)]);

export const surveyOptions = pgTable("survey_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").notNull().references(() => surveyQuestions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("so_question_idx").on(t.questionId)]);

export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  surveyId: uuid("survey_id").notNull().references(() => surveys.id, { onDelete: "cascade" }),
  respondentId: uuid("respondent_id").references(() => users.id),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("sr_survey_idx").on(t.surveyId)]);

export const surveyAnswers = pgTable("survey_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  responseId: uuid("response_id").notNull().references(() => surveyResponses.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull().references(() => surveyQuestions.id, { onDelete: "cascade" }),
  optionId: uuid("option_id").references(() => surveyOptions.id),
  textValue: text("text_value"),
  ratingValue: integer("rating_value"),
}, (t) => [index("sa_response_idx").on(t.responseId)]);