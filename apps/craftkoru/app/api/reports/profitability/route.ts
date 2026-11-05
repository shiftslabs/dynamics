import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;

  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date();

  const [sales, expenses] = await Promise.all([
    prisma.sale.findMany({ where: { businessId, createdAt: { gte: from, lte: to } }, include: { lines: true } }),
    prisma.expense.findMany({ where: { businessId, date: { gte: from, lte: to } } }),
  ]);

  const totalRevenueCents = sales.reduce((sum: number, s: any) => sum + (s.totalCents || 0), 0);
  const totalExpensesCents = expenses.reduce((sum: number, e: any) => sum + (e.amountCents || 0), 0);
  const grossProfitCents = totalRevenueCents - totalExpensesCents;

  return NextResponse.json({
    data: {
      period: { from: from.toISOString(), to: to.toISOString() },
      totalRevenueCents,
      totalExpensesCents,
      grossProfitCents,
      marginPercent: totalRevenueCents > 0 ? Math.round((grossProfitCents / totalRevenueCents) * 10000) / 100 : 0,
      salesCount: sales.length,
      expensesCount: expenses.length,
    },
  });
}

