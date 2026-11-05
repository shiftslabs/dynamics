import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const workOrders = await prisma.workOrder.findMany({ where: { businessId }, include: { customer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: workOrders });
}

export async function POST(req: Request) {
  const body = await req.json();
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
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

