import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const expenses = await prisma.expense.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: expenses });
}

export async function POST(req: Request) {
  const body = await req.json();
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
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

