import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Wrench, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnvilgridJobsPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "anvilgrid" } });
  const businessId = business?.id || "default";
  const jobs = await prisma.workOrder.findMany({ where: { businessId }, include: { customer: true }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Jobs & Work Orders</h1><p className="text-sm text-slate-500">Repair jobs, diagnostics and status.</p></div>
        <a href="/anvilgrid/jobs/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors"><Plus size={16} /> New Job</a>
      </div>
      {jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Create a repair job to track diagnostics and parts." icon={<Wrench size={36} />} />
      ) : (
        <div className="space-y-3">
          {jobs.map((job: any) => (
            <Card key={job.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">{job.customer?.name || "Walk-in"} • {job.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
