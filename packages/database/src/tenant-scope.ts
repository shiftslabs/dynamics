import { prisma } from "./client";

export class TenantScopeError extends Error {
  constructor(message = "Unauthorized access to business tenant.") {
    super(message);
    this.name = "TenantScopeError";
  }
}

export async function verifyBusinessMembership(
  userId: string,
  businessId: string
): Promise<{ businessId: string; role: string; userId: string }> {
  if (!userId || !businessId) {
    throw new TenantScopeError("Missing tenant verification parameters.");
  }

  const membership = await prisma.businessMembership.findUnique({
    where: {
      businessId_userId: {
        businessId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new TenantScopeError("User is not a member of this business.");
  }

  return {
    businessId: membership.businessId,
    role: membership.role,
    userId: membership.userId,
  };
}

export function scopeWhere<T extends object>(businessId: string, whereClause: T): T & { businessId: string } {
  if (!businessId) {
    throw new TenantScopeError("Cannot scope query without a valid businessId.");
  }
  return {
    ...whereClause,
    businessId,
  };
}
