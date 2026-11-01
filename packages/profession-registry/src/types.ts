import { z } from "zod";

export const VerticalAppEnum = z.enum([
  "craftkoru",
  "anvilgrid",
  "savorpantry",
  "ledgerverdict",
  "bazaarmart",
  "dynamicslabs"
]);
export type VerticalApp = z.infer<typeof VerticalAppEnum>;

export const TerminologyOverridesSchema = z.object({
  customerLabel: z.string(),
  customersLabel: z.string(),
  itemLabel: z.string(),
  itemsLabel: z.string(),
  orderOrJobLabel: z.string(),
  ordersOrJobsLabel: z.string(),
  appointmentLabel: z.string().optional(),
  workerLabel: z.string(),
  costingLabel: z.string().optional(),
});
export type TerminologyOverrides = z.infer<typeof TerminologyOverridesSchema>;

export const NavigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string(),
  badgeKey: z.string().optional(),
});
export type NavigationItem = z.infer<typeof NavigationItemSchema>;

export const ProfessionDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  verticalApp: VerticalAppEnum,
  description: z.string(),
  icon: z.string(),
  version: z.string().default("1.0.0"),
  terminology: TerminologyOverridesSchema,
  capabilities: z.array(z.string()),
  navigation: z.array(NavigationItemSchema),
  supportsScheduling: z.boolean().default(true),
  supportsInventory: z.boolean().default(true),
  supportsMeasurements: z.boolean().default(false),
  supportsDiagnostics: z.boolean().default(false),
  supportsPos: z.boolean().default(false),
  supportsKitchen: z.boolean().default(false),
  supportsRetainers: z.boolean().default(false),
  supportsBarcodes: z.boolean().default(false),
  defaultStatuses: z.array(z.string()),
  documentTemplates: z.array(z.string()),
});

export type ProfessionDefinition = z.infer<typeof ProfessionDefinitionSchema>;
