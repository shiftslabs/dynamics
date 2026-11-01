import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const expenses = await prisma.expense.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: expenses });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const expense = await prisma.expense.create({
    data: {
      businessId,
      amountCents: body.amountCents || 0,
      category: body.category || "general",
      description: body.description || null,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json({ data: expense }, { status: 201 });
}
