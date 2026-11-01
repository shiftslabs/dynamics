import { prisma, verifyBusinessMembership, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { InvoiceInput, ExpenseInput } from "@shiftslabs/validation";

export async function listInvoices(businessId: string, userId: string, status?: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:view");

  const where: any = { businessId };
  if (status) {
    where.status = status;
  }

  return prisma.invoice.findMany({
    where,
    include: {
      customer: true,
      lines: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvoice(
  businessId: string,
  userId: string,
  input: InvoiceInput
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:manage");

  return runInTransaction(async (tx) => {
    const businessSettings = await tx.businessSettings.findUnique({
      where: { businessId },
    });
    const prefix = businessSettings?.invoicePrefix || "INV-";
    const taxRatePercent = businessSettings?.taxRatePercent ?? 0.0;

    const count = await tx.invoice.count({ where: { businessId } });
    const invoiceNumber = `${prefix}${(count + 1).toString().padStart(5, "0")}`;

    let subtotalCents = 0;
    const linesData = input.lines.map((line) => {
      const lineTotal = Math.round(line.quantity * line.unitPriceCents);
      subtotalCents += lineTotal;
      return {
        description: line.description,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
        totalPriceCents: lineTotal,
      };
    });

    const taxCents = Math.round((subtotalCents * taxRatePercent) / 100);
    const totalCents = subtotalCents + taxCents;

    return tx.invoice.create({
      data: {
        businessId,
        customerId: input.customerId || null,
        invoiceNumber,
        dueDate: new Date(input.dueDate),
        subtotalCents,
        taxCents,
        totalCents,
        paidAmountCents: 0,
        notes: input.notes || null,
        status: "sent",
        lines: {
          create: linesData,
        },
      },
      include: {
        customer: true,
        lines: true,
      },
    });
  });
}

export async function recordInvoicePayment(
  businessId: string,
  userId: string,
  input: {
    invoiceId: string;
    amountCents: number;
    paymentMethod: string;
    reference?: string;
  }
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:manage");

  return runInTransaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({
      where: { id: input.invoiceId, businessId },
    });

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    const newPaidAmount = invoice.paidAmountCents + input.amountCents;
    const newStatus = newPaidAmount >= invoice.totalCents ? "paid" : "partial";

    await tx.paymentRecord.create({
      data: {
        invoiceId: invoice.id,
        amountCents: input.amountCents,
        paymentMethod: input.paymentMethod,
        reference: input.reference || null,
      },
    });

    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmountCents: newPaidAmount,
        status: newStatus,
      },
      include: {
        payments: true,
      },
    });
  });
}

export async function listExpenses(businessId: string, userId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:view");

  return prisma.expense.findMany({
    where: { businessId },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(
  businessId: string,
  userId: string,
  input: ExpenseInput
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:manage");

  return prisma.expense.create({
    data: {
      businessId,
      category: input.category,
      description: input.description,
      amountCents: input.amountCents,
      date: input.date ? new Date(input.date) : new Date(),
    },
  });
}

export async function getFinancialSummary(businessId: string, userId: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "finance:view");

  const [sales, invoices, expenses] = await Promise.all([
    prisma.sale.aggregate({
      where: { businessId, status: "completed" },
      _sum: { totalCents: true },
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: { in: ["paid", "partial"] } },
      _sum: { paidAmountCents: true },
    }),
    prisma.expense.aggregate({
      where: { businessId },
      _sum: { amountCents: true },
    }),
  ]);

  const salesRevenueCents = sales._sum.totalCents || 0;
  const invoiceRevenueCents = invoices._sum.paidAmountCents || 0;
  const totalRevenueCents = salesRevenueCents + invoiceRevenueCents;
  const totalExpensesCents = expenses._sum.amountCents || 0;
  const netProfitCents = totalRevenueCents - totalExpensesCents;

  return {
    salesRevenueCents,
    invoiceRevenueCents,
    totalRevenueCents,
    totalExpensesCents,
    netProfitCents,
  };
}
