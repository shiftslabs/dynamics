import { prisma, verifyBusinessMembership, scopeWhere } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { CustomerInput } from "@shiftslabs/validation";

export async function listCustomers(businessId: string, userId: string, query?: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "customers:view");

  const where: any = { businessId };
  if (query && query.trim()) {
    const q = query.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getCustomerById(businessId: string, userId: string, customerId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "customers:view");

  const customer = await prisma.customer.findFirst({
    where: scopeWhere(businessId, { id: customerId }),
    include: {
      appointments: { orderBy: { startTime: "desc" }, take: 10 },
      workOrders: { orderBy: { createdAt: "desc" }, take: 10 },
      invoices: { orderBy: { issueDate: "desc" }, take: 10 },
      measurements: { orderBy: { createdAt: "desc" }, take: 5 },
      assets: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  return customer;
}

export async function createCustomer(businessId: string, userId: string, input: CustomerInput) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "customers:manage");

  // Check duplicate email in this business
  if (input.email) {
    const existing = await prisma.customer.findFirst({
      where: { businessId, email: input.email.trim().toLowerCase() },
    });
    if (existing) {
      throw new Error("A customer with this email address already exists in your business.");
    }
  }

  return prisma.customer.create({
    data: {
      businessId,
      name: input.name.trim(),
      email: input.email ? input.email.trim().toLowerCase() : null,
      phone: input.phone?.trim() || null,
      address: input.address?.trim() || null,
      notes: input.notes?.trim() || null,
      tags: input.tags?.trim() || null,
    },
  });
}

export async function updateCustomer(
  businessId: string,
  userId: string,
  customerId: string,
  input: Partial<CustomerInput>
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "customers:manage");

  return prisma.customer.update({
    where: { id: customerId },
    data: {
      name: input.name?.trim(),
      email: input.email ? input.email.trim().toLowerCase() : undefined,
      phone: input.phone?.trim(),
      address: input.address?.trim(),
      notes: input.notes?.trim(),
      tags: input.tags?.trim(),
    },
  });
}
