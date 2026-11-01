import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const invoices = await prisma.invoice.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: invoices });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const count = await prisma.invoice.count({ where: { businessId } });
  const totalCents = body.totalCents || 0;
  const invoice = await prisma.invoice.create({
    data: {
      businessId,
      invoiceNumber: `INV-${String(count + 1).padStart(5, "0")}`,
      totalCents,
      subtotalCents: body.subtotalCents || totalCents,
      taxCents: body.taxCents || 0,
      paidAmountCents: 0,
      status: "draft",
      customerId: body.customerId || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return NextResponse.json({ data: invoice }, { status: 201 });
}
