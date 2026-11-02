import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = await prisma.workOrder.findUnique({ where: { id: params.jobId }, include: { customer: true } }).catch(() => null);

  if (!job) {
    return <EmptyState title="Job not found" description="This job may have been removed." />;
  }

  const totalCost = (job.laborCostCents || 0) + (job.materialCostCents || 0) + (job.additionalCostCents || 0);
  const profit = (job.priceChargedCents || 0) - totalCost;

  return (
    <div className="space-y-6">
      <a href="/craftkoru/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
        <ArrowLeft size={14} /> Back to jobs
      </a>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
        <p className="text-sm text-slate-500">#{job.orderNumber} • {job.status}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Price</p><p className="text-2xl font-bold">${((job.priceChargedCents || 0) / 100).toFixed(2)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Cost</p><p className="text-2xl font-bold">${(totalCost / 100).toFixed(2)}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase">Profit</p><p className="text-2xl font-bold text-emerald-600">${(profit / 100).toFixed(2)}</p></Card>
      </div>
      <Card className="p-6">
        <p className="text-sm text-slate-700"><span className="font-medium">Client:</span> {job.customer?.name || "Walk-in"}</p>
        <p className="text-sm text-slate-700 mt-2"><span className="font-medium">Due:</span> {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "Unscheduled"}</p>
      </Card>
    </div>
  );
}
