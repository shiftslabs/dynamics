import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("invoiceId");
  const payments = await prisma.paymentRecord.findMany({
    where: invoiceId ? { invoiceId } : {},
    orderBy: { paidAt: "desc" },
  });
  return NextResponse.json({ data: payments });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.invoiceId) {
    return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "invoiceId is required." } }, { status: 400 });
  }
  const payment = await prisma.paymentRecord.create({
    data: {
      invoiceId: body.invoiceId,
      amountCents: body.amountCents || 0,
      paymentMethod: body.method || "cash",
      reference: body.reference || null,
    },
  });
  return NextResponse.json({ data: payment }, { status: 201 });
}
