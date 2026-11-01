import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const customers = await prisma.customer.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: customers });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const customer = await prisma.customer.create({ data: { businessId, name: body.name, email: body.email, phone: body.phone, address: body.address } });
  return NextResponse.json({ data: customer }, { status: 201 });
}
