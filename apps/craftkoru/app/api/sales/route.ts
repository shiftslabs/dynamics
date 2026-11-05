import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const sales = await prisma.sale.findMany({
    where: { businessId },
    include: { customer: true, lines: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  }).catch(() => []);
  return NextResponse.json({ data: sales });
}

export async function POST(req: Request) {
  const body = await req.json();
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;

  const count = await prisma.sale.count({ where: { businessId } });
  const saleNumber = `SALE-${String(count + 1).padStart(6, "0")}`;

  const subtotalCents = body.subtotalCents || 0;
  const discountCents = body.discountCents || 0;
  const taxCents = body.taxCents || 0;
  const totalCents = body.totalCents || subtotalCents - discountCents + taxCents;
  const amountPaidCents = body.amountPaidCents || totalCents;

  const sale = await prisma.sale.create({
    data: {
      businessId,
      customerId: body.customerId || null,
      saleNumber,
      status: body.status || "completed",
      paymentMethod: body.paymentMethod || "cash",
      subtotalCents,
      discountCents,
      taxCents,
      totalCents,
      amountPaidCents,
      changeGivenCents: Math.max(0, amountPaidCents - totalCents),
      idempotencyKey: body.idempotencyKey || null,
      lines: body.lines && Array.isArray(body.lines)
        ? {
            create: body.lines.map((line: any) => ({
              productId: line.productId || null,
              name: line.name || "Item",
              quantity: line.quantity || 1,
              unitPriceCents: line.unitPriceCents || 0,
              totalPriceCents: line.totalPriceCents || (line.unitPriceCents || 0) * (line.quantity || 1),
            })),
          }
        : undefined,
    },
    include: { lines: true, customer: true },
  });

  return NextResponse.json({ data: sale }, { status: 201 });
}

