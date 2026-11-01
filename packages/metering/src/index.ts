import { prisma } from "@shiftslabs/database";
import { SHIFTSLABS_PLANS, PlanDefinition } from "@shiftslabs/config";

export async function getBusinessUsage(businessId: string) {
  let usage = await prisma.usageAccount.findUnique({
    where: { businessId },
  });

  if (!usage) {
    usage = await prisma.usageAccount.create({
      data: { businessId },
    });
  }

  // Check if daily AI reset is needed (UTC day boundary)
  const now = new Date();
  const resetAt = new Date(usage.aiDailyResetAt);
  const isDifferentDay =
    now.getUTCFullYear() !== resetAt.getUTCFullYear() ||
    now.getUTCMonth() !== resetAt.getUTCMonth() ||
    now.getUTCDate() !== resetAt.getUTCDate();

  if (isDifferentDay) {
    usage = await prisma.usageAccount.update({
      where: { id: usage.id },
      data: {
        aiDailyCount: 0,
        aiDailyResetAt: now,
      },
    });
  }

  return {
    logicalDbBytes: Number(usage.logicalDbBytes),
    mediaStorageBytes: Number(usage.mediaStorageBytes),
    aiDailyCount: usage.aiDailyCount,
    aiDailyResetAt: usage.aiDailyResetAt,
  };
}

export async function incrementAiUsage(businessId: string, limit: number): Promise<boolean> {
  const usage = await getBusinessUsage(businessId);
  if (usage.aiDailyCount >= limit) {
    return false; // Quota reached
  }

  await prisma.usageAccount.update({
    where: { businessId },
    data: {
      aiDailyCount: { increment: 1 },
    },
  });

  return true;
}

export async function recordMediaStorageAddition(businessId: string, sizeBytes: number) {
  await prisma.usageAccount.upsert({
    where: { businessId },
    create: {
      businessId,
      mediaStorageBytes: BigInt(sizeBytes),
    },
    update: {
      mediaStorageBytes: { increment: BigInt(sizeBytes) },
    },
  });
}

export async function calculateLogicalDatabaseUsage(businessId: string): Promise<number> {
  const [customers, products, sales, invoices, workOrders] = await Promise.all([
    prisma.customer.count({ where: { businessId } }),
    prisma.product.count({ where: { businessId } }),
    prisma.sale.count({ where: { businessId } }),
    prisma.invoice.count({ where: { businessId } }),
    prisma.workOrder.count({ where: { businessId } }),
  ]);

  // Deterministic serialization standard: 1KB average indexed weight per transactional entity
  const estimatedBytes =
    customers * 1024 +
    products * 1536 +
    sales * 2048 +
    invoices * 2048 +
    workOrders * 2048 +
    50000; // base tenant metadata

  await prisma.usageAccount.upsert({
    where: { businessId },
    create: {
      businessId,
      logicalDbBytes: BigInt(estimatedBytes),
    },
    update: {
      logicalDbBytes: BigInt(estimatedBytes),
    },
  });

  return estimatedBytes;
}
