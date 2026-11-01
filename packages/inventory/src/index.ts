import { prisma, verifyBusinessMembership, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";

export async function listStockItems(businessId: string, userId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "inventory:view");

  return prisma.stockItem.findMany({
    where: { businessId },
    include: {
      product: true,
      movements: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function adjustStock(
  businessId: string,
  userId: string,
  input: {
    stockItemId: string;
    quantityDelta: number; // positive for addition, negative for reduction
    reason: string;
    referenceId?: string;
  }
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "inventory:manage");

  return runInTransaction(async (tx) => {
    const stockItem = await tx.stockItem.findFirst({
      where: { id: input.stockItemId, businessId },
    });

    if (!stockItem) {
      throw new Error("Stock item not found.");
    }

    const newStock = stockItem.currentStock + input.quantityDelta;
    if (newStock < 0) {
      throw new Error("Insufficient stock level for this adjustment.");
    }

    await tx.stockItem.update({
      where: { id: stockItem.id },
      data: { currentStock: newStock },
    });

    const movement = await tx.inventoryMovement.create({
      data: {
        stockItemId: stockItem.id,
        type: input.quantityDelta >= 0 ? "purchase" : "adjustment",
        quantity: input.quantityDelta,
        balanceAfter: newStock,
        reason: input.reason,
        referenceId: input.referenceId || null,
      },
    });

    return { stockItem: { ...stockItem, currentStock: newStock }, movement };
  });
}

export async function getLowStockAlerts(businessId: string, userId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "inventory:view");

  const items = await prisma.stockItem.findMany({
    where: {
      businessId,
    },
    include: {
      product: true,
    },
  });

  return items.filter((item) => item.currentStock <= item.reorderLevel);
}
