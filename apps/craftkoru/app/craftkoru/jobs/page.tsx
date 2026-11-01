import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Scissors, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const jobs = await prisma.workOrder.findMany({
    where: { businessId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Custom Jobs</h1>
          <p className="text-sm text-slate-500">Bespoke work orders, costing and profitability.</p>
        </div>
        <a href="/craftkoru/jobs/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors">
          <Plus size={16} /> New Job
        </a>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Create a bespoke job to track materials, labour and profit." actionText="Create Job" icon={<Scissors size={36} />} />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const totalCost = (job.laborCostCents || 0) + (job.materialCostCents || 0) + (job.additionalCostCents || 0);
            const profit = (job.priceChargedCents || 0) - totalCost;
            const margin = job.priceChargedCents > 0 ? ((profit / job.priceChargedCents) * 100).toFixed(0) : "0";
            return (
              <Card key={job.id} hoverable className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{job.title}</span>
                      <span className="text-xs text-slate-400 font-mono">#{job.orderNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{job.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Client: {job.customer?.name || "Walk-in"} • Due: {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "Unscheduled"}
                    </p>
                  </div>
                  <div className="text-right sm:border-l sm:pl-4 border-slate-100">
                    <span className="text-xs text-slate-400 block">Charged / Profit</span>
                    <span className="text-sm font-bold text-slate-900">${((job.priceChargedCents || 0) / 100).toFixed(2)}</span>
                    <span className="text-xs text-emerald-600 font-medium block">+${(profit / 100).toFixed(2)} ({margin}%)</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
