import { prisma, verifyBusinessMembership, scopeWhere, runInTransaction } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { WorkOrderInput } from "@shiftslabs/validation";

export interface JobProfitabilitySummary {
  priceChargedCents: number;
  laborCostCents: number;
  materialCostCents: number;
  additionalCostCents: number;
  totalCostCents: number;
  grossProfitCents: number;
  marginPercent: number;
}

export function calculateJobProfitability(job: {
  priceChargedCents: number;
  laborCostCents: number;
  materialCostCents: number;
  additionalCostCents: number;
}): JobProfitabilitySummary {
  const totalCostCents = job.laborCostCents + job.materialCostCents + job.additionalCostCents;
  const grossProfitCents = job.priceChargedCents - totalCostCents;
  const marginPercent =
    job.priceChargedCents > 0
      ? Math.round((grossProfitCents / job.priceChargedCents) * 10000) / 100
      : 0;

  return {
    priceChargedCents: job.priceChargedCents,
    laborCostCents: job.laborCostCents,
    materialCostCents: job.materialCostCents,
    additionalCostCents: job.additionalCostCents,
    totalCostCents,
    grossProfitCents,
    marginPercent,
  };
}

export async function listWorkOrders(businessId: string, userId: string, status?: string) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "jobs:view");

  const where: any = { businessId };
  if (status) {
    where.status = status;
  }

  const jobs = await prisma.workOrder.findMany({
    where,
    include: {
      customer: true,
      lines: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return jobs.map((job) => ({
    ...job,
    profitability: calculateJobProfitability(job),
  }));
}

export async function createWorkOrder(
  businessId: string,
  userId: string,
  input: WorkOrderInput
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "jobs:manage");

  const count = await prisma.workOrder.count({ where: { businessId } });
  const orderNumber = `JOB-${(count + 1).toString().padStart(4, "0")}`;

  return runInTransaction(async (tx) => {
    let materialCost = input.materialCostCents;
    let laborCost = input.laborCostCents;
    let priceCharged = input.priceChargedCents;

    if (input.lines && input.lines.length > 0) {
      let linesMatCost = 0;
      let linesLaborCost = 0;
      let linesPrice = 0;

      for (const line of input.lines) {
        const cost = Math.round(line.quantity * line.unitCostCents);
        const price = Math.round(line.quantity * line.unitPriceCents);
        if (line.type === "material" || line.type === "part") linesMatCost += cost;
        if (line.type === "labor" || line.type === "service") linesLaborCost += cost;
        linesPrice += price;
      }

      if (linesMatCost > 0) materialCost = linesMatCost;
      if (linesLaborCost > 0) laborCost = linesLaborCost;
      if (linesPrice > 0 && priceCharged === 0) priceCharged = linesPrice;
    }

    const job = await tx.workOrder.create({
      data: {
        businessId,
        orderNumber,
        customerId: input.customerId || null,
        title: input.title,
        description: input.description || null,
        priority: input.priority || "normal",
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        technicianName: input.technicianName || null,
        status: "intake",
        laborCostCents: laborCost,
        materialCostCents: materialCost,
        additionalCostCents: input.additionalCostCents,
        priceChargedCents: priceCharged,
        lines: input.lines
          ? {
              create: input.lines.map((l) => ({
                type: l.type,
                description: l.description,
                quantity: l.quantity,
                unitCostCents: l.unitCostCents,
                unitPriceCents: l.unitPriceCents,
                totalCostCents: Math.round(l.quantity * l.unitCostCents),
                totalPriceCents: Math.round(l.quantity * l.unitPriceCents),
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        lines: true,
      },
    });

    return {
      ...job,
      profitability: calculateJobProfitability(job),
    };
  });
}

export async function updateWorkOrderStatus(
  businessId: string,
  userId: string,
  jobId: string,
  status: string
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "jobs:manage");

  return prisma.workOrder.update({
    where: { id: jobId },
    data: { status },
  });
}
