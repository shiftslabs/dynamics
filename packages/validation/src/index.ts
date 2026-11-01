import { z } from "zod";

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters long."),
});

// Business Schemas
export const CreateBusinessSchema = z.object({
  name: z.string().min(2, "Business name is required."),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes."),
  professionId: z.string().min(1),
  defaultApp: z.enum(["craftkoru", "anvilgrid", "savorpantry", "ledgerverdict", "bazaarmart"]),
  currency: z.string().length(3).default("USD"),
  timezone: z.string().default("UTC"),
});
export type CreateBusinessInput = z.infer<typeof CreateBusinessSchema>;

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    "owner",
    "admin",
    "manager",
    "supervisor",
    "staff",
    "cashier",
    "technician",
    "accountant",
    "viewer",
  ]),
});

// Customer Schemas
export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required."),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});
export type CustomerInput = z.infer<typeof CustomerSchema>;

// Scheduling
export const AppointmentSchema = z.object({
  customerId: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  serviceName: z.string().optional(),
  staffName: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});
export type AppointmentInput = z.infer<typeof AppointmentSchema>;

// Work Order / Job
export const WorkOrderSchema = z.object({
  customerId: z.string().optional(),
  title: z.string().min(1, "Job title is required."),
  description: z.string().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  dueDate: z.string().datetime().optional(),
  technicianName: z.string().optional(),
  laborCostCents: z.number().int().nonnegative().default(0),
  materialCostCents: z.number().int().nonnegative().default(0),
  additionalCostCents: z.number().int().nonnegative().default(0),
  priceChargedCents: z.number().int().nonnegative().default(0),
  lines: z
    .array(
      z.object({
        type: z.enum(["labor", "material", "service", "part"]),
        description: z.string().min(1),
        quantity: z.number().positive().default(1),
        unitCostCents: z.number().int().nonnegative().default(0),
        unitPriceCents: z.number().int().nonnegative().default(0),
      })
    )
    .optional(),
});
export type WorkOrderInput = z.infer<typeof WorkOrderSchema>;

// Catalogue & Products
export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required."),
  sku: z.string().optional().or(z.literal("")),
  barcode: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  type: z.enum(["product", "service", "material"]).default("product"),
  sellingPriceCents: z.number().int().nonnegative().default(0),
  costPriceCents: z.number().int().nonnegative().default(0),
  initialStock: z.number().nonnegative().optional(),
});
export type ProductInput = z.infer<typeof ProductSchema>;

// POS Sale
export const PosSaleLineSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  quantity: z.number().positive(),
  unitPriceCents: z.number().int().nonnegative(),
});

export const PosSaleSchema = z.object({
  customerId: z.string().optional(),
  lines: z.array(PosSaleLineSchema).min(1, "Sale must have at least one line item."),
  paymentMethod: z.enum(["cash", "card", "transfer", "paystack"]).default("cash"),
  discountCents: z.number().int().nonnegative().default(0),
  amountPaidCents: z.number().int().nonnegative(),
  idempotencyKey: z.string().min(8, "Idempotency key is required."),
});
export type PosSaleInput = z.infer<typeof PosSaleSchema>;

// Finance & Invoice
export const InvoiceLineSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive().default(1),
  unitPriceCents: z.number().int().nonnegative(),
});

export const InvoiceSchema = z.object({
  customerId: z.string().optional(),
  dueDate: z.string().datetime(),
  lines: z.array(InvoiceLineSchema).min(1, "Invoice must contain at least one line item."),
  notes: z.string().optional(),
});
export type InvoiceInput = z.infer<typeof InvoiceSchema>;

export const ExpenseSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1),
  amountCents: z.number().int().positive("Expense amount must be positive."),
  date: z.string().datetime().optional(),
});
export type ExpenseInput = z.infer<typeof ExpenseSchema>;

// AdvertiseMe Campaign
export const AdCampaignSchema = z.object({
  businessName: z.string().min(1, "Business name is required."),
  contactEmail: z.string().email("Valid contact email is required."),
  headline: z.string().min(5).max(80, "Headline must be between 5 and 80 characters."),
  description: z.string().min(10).max(300, "Description must be between 10 and 300 characters."),
  ctaType: z.enum(["learn_more", "visit_website", "whatsapp", "contact"]),
  ctaUrl: z.string().url("Valid destination URL is required."),
  mediaUrl: z.string().url("Valid media asset URL is required."),
  mediaType: z.enum(["image", "video"]).default("image"),
  durationMonths: z.union([z.literal(1), z.literal(2)]).default(1),
});
export type AdCampaignInput = z.infer<typeof AdCampaignSchema>;

// AI Chat
export const AIChatMessageSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1).max(4000),
});
export type AIChatMessageInput = z.infer<typeof AIChatMessageSchema>;
