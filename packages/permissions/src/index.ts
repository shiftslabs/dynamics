export type BusinessRole =
  | "owner"
  | "admin"
  | "manager"
  | "supervisor"
  | "staff"
  | "cashier"
  | "technician"
  | "accountant"
  | "viewer";

export type Capability =
  | "business:manage"
  | "business:view"
  | "members:manage"
  | "members:view"
  | "billing:manage"
  | "billing:view"
  | "finance:manage"
  | "finance:view"
  | "customers:manage"
  | "customers:view"
  | "scheduling:manage"
  | "scheduling:view"
  | "inventory:manage"
  | "inventory:view"
  | "purchasing:manage"
  | "purchasing:view"
  | "pos:operate"
  | "jobs:manage"
  | "jobs:execute"
  | "jobs:view"
  | "documents:manage"
  | "documents:view"
  | "reports:view"
  | "ai:use"
  | "settings:manage";

export const ROLE_CAPABILITIES: Record<BusinessRole, Capability[]> = {
  owner: [
    "business:manage",
    "business:view",
    "members:manage",
    "members:view",
    "billing:manage",
    "billing:view",
    "finance:manage",
    "finance:view",
    "customers:manage",
    "customers:view",
    "scheduling:manage",
    "scheduling:view",
    "inventory:manage",
    "inventory:view",
    "purchasing:manage",
    "purchasing:view",
    "pos:operate",
    "jobs:manage",
    "jobs:execute",
    "jobs:view",
    "documents:manage",
    "documents:view",
    "reports:view",
    "ai:use",
    "settings:manage"
  ],
  admin: [
    "business:manage",
    "business:view",
    "members:manage",
    "members:view",
    "billing:view",
    "finance:manage",
    "finance:view",
    "customers:manage",
    "customers:view",
    "scheduling:manage",
    "scheduling:view",
    "inventory:manage",
    "inventory:view",
    "purchasing:manage",
    "purchasing:view",
    "pos:operate",
    "jobs:manage",
    "jobs:execute",
    "jobs:view",
    "documents:manage",
    "documents:view",
    "reports:view",
    "ai:use",
    "settings:manage"
  ],
  manager: [
    "business:view",
    "members:view",
    "finance:view",
    "customers:manage",
    "customers:view",
    "scheduling:manage",
    "scheduling:view",
    "inventory:manage",
    "inventory:view",
    "purchasing:manage",
    "purchasing:view",
    "pos:operate",
    "jobs:manage",
    "jobs:execute",
    "jobs:view",
    "documents:manage",
    "documents:view",
    "reports:view",
    "ai:use"
  ],
  supervisor: [
    "business:view",
    "customers:manage",
    "customers:view",
    "scheduling:manage",
    "scheduling:view",
    "inventory:view",
    "pos:operate",
    "jobs:manage",
    "jobs:execute",
    "jobs:view",
    "documents:view",
    "ai:use"
  ],
  staff: [
    "business:view",
    "customers:manage",
    "customers:view",
    "scheduling:manage",
    "scheduling:view",
    "pos:operate",
    "jobs:execute",
    "jobs:view",
    "documents:view",
    "ai:use"
  ],
  cashier: [
    "business:view",
    "customers:manage",
    "customers:view",
    "pos:operate",
    "inventory:view"
  ],
  technician: [
    "business:view",
    "customers:view",
    "scheduling:view",
    "jobs:execute",
    "jobs:view",
    "inventory:view",
    "documents:view",
    "ai:use"
  ],
  accountant: [
    "business:view",
    "finance:manage",
    "finance:view",
    "billing:view",
    "purchasing:view",
    "inventory:view",
    "reports:view",
    "documents:view"
  ],
  viewer: [
    "business:view",
    "customers:view",
    "scheduling:view",
    "jobs:view",
    "inventory:view",
    "documents:view",
    "reports:view"
  ]
};

export function hasCapability(role: BusinessRole, capability: Capability): boolean {
  const caps = ROLE_CAPABILITIES[role];
  return Boolean(caps && caps.includes(capability));
}

export function assertCapability(role: BusinessRole, capability: Capability): void {
  if (!hasCapability(role, capability)) {
    throw new Error(`Unauthorized action: role '${role}' lacks capability '${capability}'`);
  }
}
