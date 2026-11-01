import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const services = await prisma.product.findMany({ where: { businessId, type: "service" }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: services });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const service = await prisma.product.create({
    data: {
      businessId,
      name: body.name,
      description: body.description || null,
      type: "service",
      sellingPriceCents: body.priceCents || 0,
      costPriceCents: body.costPriceCents || 0,
      isActive: true,
    },
  });
  return NextResponse.json({ data: service }, { status: 201 });
}
