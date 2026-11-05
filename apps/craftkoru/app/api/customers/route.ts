import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const customers = await prisma.customer.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: customers });
}

export async function POST(req: Request) {
  const body = await req.json();
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const customer = await prisma.customer.create({ data: { businessId, name: body.name, email: body.email, phone: body.phone, address: body.address } });
  return NextResponse.json({ data: customer }, { status: 201 });
}

