import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "anvilgrid" } });
  const businessId = business?.id || "default";
  const jobs = await prisma.workOrder.findMany({ where: { businessId }, include: { customer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: jobs });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "anvilgrid" } });
  const businessId = business?.id || "default";
  const count = await prisma.workOrder.count({ where: { businessId } });
  const job = await prisma.workOrder.create({
    data: {
      businessId,
      title: body.title,
      orderNumber: `AG-${String(count + 1).padStart(5, "0")}`,
      customerId: body.customerId || null,
      status: "intake",
      priceChargedCents: body.priceChargedCents || 0,
      laborCostCents: body.laborCostCents || 0,
      materialCostCents: body.materialCostCents || 0,
      additionalCostCents: body.additionalCostCents || 0,
      notes: body.notes || null,
    },
  });
  return NextResponse.json({ data: job }, { status: 201 });
}
