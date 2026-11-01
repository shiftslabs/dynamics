import { prisma, verifyBusinessMembership, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { PosSaleInput } from "@shiftslabs/validation";

export async function processPosSale(
  businessId: string,
  userId: string,
  input: PosSaleInput
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "pos:operate");

  // Idempotency check: if sale already created with this idempotency key, return existing record
  const existingSale = await prisma.sale.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    include: { lines: true, customer: true },
  });
  if (existingSale) {
    return existingSale;
  }

  return runInTransaction(async (tx) => {
    const businessSettings = await tx.businessSettings.findUnique({
      where: { businessId },
    });
    const taxRatePercent = businessSettings?.taxRatePercent ?? 0.0;
    const autoDeductStock = businessSettings?.autoDeductStockOnSale ?? true;

    // Server-side calculation
    let calculatedSubtotal = 0;
    const verifiedLines: {
      productId: string | null;
      name: string;
      quantity: number;
      unitPriceCents: number;
      totalPriceCents: number;
    }[] = [];

    for (const line of input.lines) {
      let unitPrice = line.unitPriceCents;
      if (line.productId) {
        const dbProduct = await tx.product.findFirst({
          where: { id: line.productId, businessId },
        });
        if (dbProduct) {
          unitPrice = dbProduct.sellingPriceCents;
        }
      }
      const lineTotal = Math.round(line.quantity * unitPrice);
      calculatedSubtotal += lineTotal;
      verifiedLines.push({
        productId: line.productId || null,
        name: line.name,
        quantity: line.quantity,
        unitPriceCents: unitPrice,
        totalPriceCents: lineTotal,
      });
    }

    const discountCents = Math.min(input.discountCents, calculatedSubtotal);
    const taxableAmount = calculatedSubtotal - discountCents;
    const calculatedTax = Math.round((taxableAmount * taxRatePercent) / 100);
    const calculatedTotal = taxableAmount + calculatedTax;

    if (input.amountPaidCents < calculatedTotal && input.paymentMethod === "cash") {
      throw new Error(`Amount tendered ($${(input.amountPaidCents / 100).toFixed(2)}) is less than total ($${(calculatedTotal / 100).toFixed(2)}).`);
    }

    const changeGivenCents = Math.max(0, input.amountPaidCents - calculatedTotal);

    const saleCount = await tx.sale.count({ where: { businessId } });
    const saleNumber = `SALE-${(saleCount + 1).toString().padStart(5, "0")}`;

    const sale = await tx.sale.create({
      data: {
        businessId,
        customerId: input.customerId || null,
        saleNumber,
        paymentMethod: input.paymentMethod,
        subtotalCents: calculatedSubtotal,
        discountCents,
        taxCents: calculatedTax,
        totalCents: calculatedTotal,
        amountPaidCents: input.amountPaidCents,
        changeGivenCents,
        idempotencyKey: input.idempotencyKey,
        lines: {
          create: verifiedLines.map((vl) => ({
            productId: vl.productId,
            name: vl.name,
            quantity: vl.quantity,
            unitPriceCents: vl.unitPriceCents,
            totalPriceCents: vl.totalPriceCents,
          })),
        },
      },
      include: {
        lines: true,
        customer: true,
      },
    });

    // Auto stock deduction
    if (autoDeductStock) {
      for (const line of verifiedLines) {
        if (line.productId) {
          const stockItem = await tx.stockItem.findUnique({
            where: { productId: line.productId },
          });
          if (stockItem) {
            const newStock = stockItem.currentStock - line.quantity;
            await tx.stockItem.update({
              where: { id: stockItem.id },
              data: { currentStock: newStock },
            });
            await tx.inventoryMovement.create({
              data: {
                stockItemId: stockItem.id,
                type: "sale",
                quantity: -line.quantity,
                balanceAfter: newStock,
                reason: `POS sale #${saleNumber}`,
                referenceId: sale.id,
              },
            });
          }
        }
      }
    }

    // Update active cash drawer if sale was in cash
    if (input.paymentMethod === "cash") {
      const activeDrawer = await tx.cashDrawer.findFirst({
        where: { businessId, status: "open" },
        orderBy: { openedAt: "desc" },
      });
      if (activeDrawer) {
        await tx.cashDrawer.update({
          where: { id: activeDrawer.id },
          data: {
            cashSalesCents: activeDrawer.cashSalesCents + calculatedTotal,
          },
        });
      }
    }

    return sale;
  });
}

export async function openCashDrawer(
  businessId: string,
  userId: string,
  openingBalanceCents: number
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "pos:operate");

  const existing = await prisma.cashDrawer.findFirst({
    where: { businessId, status: "open" },
  });
  if (existing) {
    return existing;
  }

  return prisma.cashDrawer.create({
    data: {
      businessId,
      openingBalanceCents,
      status: "open",
    },
  });
}

export async function closeCashDrawer(
  businessId: string,
  userId: string,
  drawerId: string,
  actualCloseCents: number,
  notes?: string
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "pos:operate");

  const drawer = await prisma.cashDrawer.findFirst({
    where: { id: drawerId, businessId },
  });
  if (!drawer || drawer.status !== "open") {
    throw new Error("Active cash drawer not found.");
  }

  const expectedCloseCents =
    drawer.openingBalanceCents +
    drawer.cashSalesCents +
    drawer.cashInCents -
    drawer.cashOutCents;

  return prisma.cashDrawer.update({
    where: { id: drawer.id },
    data: {
      status: "closed",
      closedAt: new Date(),
      expectedCloseCents,
      actualCloseCents,
      notes: notes || null,
    },
  });
}
