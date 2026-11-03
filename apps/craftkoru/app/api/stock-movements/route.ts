import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stockItemId = searchParams.get("stockItemId");
  const where = stockItemId ? { stockItemId } : {};
  const movements = await prisma.inventoryMovement.findMany({
    where,
    include: { stockItem: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ data: movements });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.stockItemId) {
    return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "stockItemId is required." } }, { status: 400 });
  }

  const stockItem = await prisma.stockItem.findUnique({ where: { id: body.stockItemId } });
  if (!stockItem) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Stock item not found." } }, { status: 404 });
  }

  const quantity = Number(body.quantity) || 0;
  const type = body.type || "adjustment";
  const newBalance = (stockItem.currentStock || 0) + quantity;

  const movement = await prisma.$transaction(async (tx) => {
    const mv = await tx.inventoryMovement.create({
      data: {
        stockItemId: stockItem.id,
        type,
        quantity,
        balanceAfter: newBalance,
        reason: body.reason || null,
        referenceId: body.referenceId || null,
      },
    });
    await tx.stockItem.update({
      where: { id: stockItem.id },
      data: { currentStock: newBalance },
    });
    return mv;
  });

  return NextResponse.json({ data: movement }, { status: 201 });
}
