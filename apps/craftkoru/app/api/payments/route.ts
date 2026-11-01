import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const payments = await prisma.payment.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: payments });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const payment = await prisma.payment.create({
    data: {
      businessId,
      amountCents: body.amountCents || 0,
      method: body.method || "cash",
      reference: body.reference || null,
      invoiceId: body.invoiceId || null,
    },
  });
  return NextResponse.json({ data: payment }, { status: 201 });
}
