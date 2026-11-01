import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfitabilityPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const jobs = await prisma.workOrder.findMany({ where: { businessId }, take: 100 }).catch(() => []);

  const revenue = jobs.reduce((a, j) => a + (j.priceChargedCents || 0), 0);
  const cost = jobs.reduce((a, j) => a + (j.laborCostCents || 0) + (j.materialCostCents || 0) + (j.additionalCostCents || 0), 0);
  const profit = revenue - cost;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profitability</h1>
        <p className="text-sm text-slate-500">Revenue, cost and margin by job.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Revenue</p><p className="text-2xl font-bold">${(revenue / 100).toFixed(2)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Cost</p><p className="text-2xl font-bold">${(cost / 100).toFixed(2)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Profit</p><p className="text-2xl font-bold text-emerald-600">${(profit / 100).toFixed(2)}</p></Card>
      </div>
      {jobs.length === 0 && <EmptyState title="No data yet" description="Complete jobs to see profitability." icon={<TrendingUp size={36} />} />}
    </div>
  );
}
