import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const materials = await prisma.product.findMany({ where: { businessId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: materials });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const material = await prisma.product.create({
    data: {
      businessId,
      name: body.name,
      sku: body.sku || null,
      costPriceCents: body.costPriceCents || 0,
      sellingPriceCents: body.sellingPriceCents || 0,
      stockQuantity: body.stockQuantity || 0,
      unit: body.unit || "unit",
      isActive: true,
    },
  });
  return NextResponse.json({ data: material }, { status: 201 });
}
