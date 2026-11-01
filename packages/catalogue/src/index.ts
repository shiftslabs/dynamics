import { prisma, verifyBusinessMembership, scopeWhere, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { ProductInput } from "@shiftslabs/validation";

export async function listProducts(businessId: string, userId: string, type?: "product" | "service" | "material") {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "inventory:view");

  const where: any = { businessId };
  if (type) {
    where.type = type;
  }

  return prisma.product.findMany({
    where,
    include: {
      stockItem: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(businessId: string, userId: string, input: ProductInput) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "inventory:manage");

  return runInTransaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        businessId,
        name: input.name,
        sku: input.sku || null,
        barcode: input.barcode || null,
        category: input.category || null,
        type: input.type,
        sellingPriceCents: input.sellingPriceCents,
        costPriceCents: input.costPriceCents,
        isActive: true,
      },
    });

    if (input.type === "product" || input.type === "material") {
      const initialStock = input.initialStock ?? 0;
      const stockItem = await tx.stockItem.create({
        data: {
          businessId,
          productId: product.id,
          name: input.name,
          currentStock: initialStock,
          unit: "pcs",
        },
      });

      if (initialStock > 0) {
        await tx.inventoryMovement.create({
          data: {
            stockItemId: stockItem.id,
            type: "adjustment",
            quantity: initialStock,
            balanceAfter: initialStock,
            reason: "Initial opening stock count",
          },
        });
      }
    }

    return product;
  });
}
