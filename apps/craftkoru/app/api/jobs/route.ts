import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const workOrders = await prisma.workOrder.findMany({ where: { businessId }, include: { customer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: workOrders });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const count = await prisma.workOrder.count({ where: { businessId } });
  const workOrder = await prisma.workOrder.create({
    data: {
      businessId,
      title: body.title,
      orderNumber: `CK-${String(count + 1).padStart(5, "0")}`,
      customerId: body.customerId || null,
      status: "draft",
      priceChargedCents: body.priceChargedCents || 0,
      laborCostCents: body.laborCostCents || 0,
      materialCostCents: body.materialCostCents || 0,
      additionalCostCents: body.additionalCostCents || 0,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      description: body.notes || null,
    },
  });
  return NextResponse.json({ data: workOrder }, { status: 201 });
}
