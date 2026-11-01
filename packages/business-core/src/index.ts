import { prisma, verifyBusinessMembership, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { CreateBusinessInput } from "@shiftslabs/validation";
import crypto from "node:crypto";

export async function createBusiness(ownerId: string, input: CreateBusinessInput) {
  const existing = await prisma.business.findUnique({
    where: { slug: input.slug },
  });

  if (existing) {
    throw new Error("A business with this unique address (slug) already exists.");
  }

  return runInTransaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        ownerId,
        name: input.name,
        slug: input.slug,
        professionId: input.professionId,
        defaultApp: input.defaultApp,
        currency: input.currency || "USD",
        timezone: input.timezone || "UTC",
        profile: {
          create: {},
        },
        settings: {
          create: {},
        },
        memberships: {
          create: {
            userId: ownerId,
            role: "owner",
          },
        },
        usageAccount: {
          create: {},
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    });

    return business;
  });
}

export async function getUserBusinesses(userId: string) {
  const memberships = await prisma.businessMembership.findMany({
    where: { userId },
    include: {
      business: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return memberships.map((m) => ({
    ...m.business,
    role: m.role as BusinessRole,
  }));
}

export async function getBusinessById(businessId: string, userId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      profile: true,
      settings: true,
      locations: true,
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!business) {
    throw new Error("Business not found.");
  }

  return {
    ...business,
    currentUserRole: role as BusinessRole,
  };
}

export async function updateBusiness(
  businessId: string,
  userId: string,
  data: {
    name?: string;
    currency?: string;
    timezone?: string;
    taxRatePercent?: number;
    description?: string;
    phone?: string;
    address?: string;
  }
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "business:manage");

  return runInTransaction(async (tx) => {
    const updated = await tx.business.update({
      where: { id: businessId },
      data: {
        name: data.name,
        currency: data.currency,
        timezone: data.timezone,
        profile: {
          update: {
            description: data.description,
            phone: data.phone,
            address: data.address,
          },
        },
        settings: {
          update: {
            taxRatePercent: data.taxRatePercent,
          },
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    });
    return updated;
  });
}

export async function inviteBusinessMember(
  businessId: string,
  userId: string,
  email: string,
  role: BusinessRole
) {
  const { role: requesterRole } = await verifyBusinessMembership(userId, businessId);
  assertCapability(requesterRole as BusinessRole, "members:manage");

  const normalizedEmail = email.trim().toLowerCase();
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.businessInvitation.create({
    data: {
      businessId,
      email: normalizedEmail,
      role,
      tokenHash,
      expiresAt,
    },
  });

  return { rawToken, email: normalizedEmail };
}

export async function acceptBusinessInvitation(token: string, userId: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const invitation = await prisma.businessInvitation.findUnique({
    where: { tokenHash },
  });

  if (!invitation || new Date() > invitation.expiresAt || invitation.status !== "pending") {
    throw new Error("This invitation is invalid or has expired.");
  }

  return runInTransaction(async (tx) => {
    await tx.businessMembership.upsert({
      where: {
        businessId_userId: {
          businessId: invitation.businessId,
          userId,
        },
      },
      create: {
        businessId: invitation.businessId,
        userId,
        role: invitation.role,
      },
      update: {
        role: invitation.role,
      },
    });

    await tx.businessInvitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    return { businessId: invitation.businessId };
  });
}
