import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, Badge, EmptyState } from "@shiftslabs/ui";
import { Briefcase, Calendar, Users, DollarSign, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CraftkoruDashboard() {
  // Fetch real data from primary test business
  const business = await prisma.business.findFirst({
    where: { defaultApp: "craftkoru" },
  });

  const businessId = business?.id || "default";

  const [jobs, appointments, customers, openInvoices] = await Promise.all([
    prisma.workOrder.findMany({
      where: { businessId },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { businessId, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
    prisma.customer.count({ where: { businessId } }),
    prisma.invoice.findMany({
      where: { businessId, status: { in: ["sent", "partial", "overdue"] } },
    }),
  ]);

  const outstandingBalanceCents = openInvoices.reduce(
    (acc, inv) => acc + (inv.totalCents - inv.paidAmountCents),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Atelier & Services Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time operations for custom tailoring, grooming, and personal styling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/craftkoru/jobs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            <Plus size={16} /> New Bespoke Job
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Active Jobs</span>
            <Briefcase size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{jobs.length}</p>
          <span className="text-xs text-slate-500">In production</span>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Upcoming Fittings</span>
            <Calendar size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{appointments.length}</p>
          <span className="text-xs text-slate-500">Scheduled sessions</span>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Clients</span>
            <Users size={18} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{customers}</p>
          <span className="text-xs text-slate-500">Profiles & measurements</span>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Outstanding</span>
            <DollarSign size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ${(outstandingBalanceCents / 100).toFixed(2)}
          </p>
          <span className="text-xs text-slate-500">Uncollected balances</span>
        </Card>
      </div>

      {/* Recent Bespoke Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Current Work Orders & Bespoke Jobs</h2>
            <a href="/craftkoru/jobs" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </a>
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              title="No work orders in progress"
              description="Create your first bespoke tailoring or personal service job to track measurements, BOM material recipes, and gross profit."
              actionText="Create Work Order"
              icon={<Briefcase size={36} />}
            />
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const totalCost = job.laborCostCents + job.materialCostCents + job.additionalCostCents;
                const profit = job.priceChargedCents - totalCost;
                const margin = job.priceChargedCents > 0 ? ((profit / job.priceChargedCents) * 100).toFixed(0) : "0";

                return (
                  <Card key={job.id} hoverable className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{job.title}</span>
                          <span className="text-xs text-slate-400 font-mono">#{job.orderNumber}</span>
                          <Badge variant={job.status === "completed" ? "success" : "info"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Client: {job.customer?.name || "Walk-in client"} • Due:{" "}
                          {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "Unscheduled"}
                        </p>
                      </div>

                      <div className="text-right sm:border-l sm:pl-4 border-slate-100">
                        <span className="text-xs text-slate-400 block">Charged / Profit</span>
                        <span className="text-sm font-bold text-slate-900">
                          ${(job.priceChargedCents / 100).toFixed(2)}
                        </span>
                        <span className="text-xs text-emerald-600 font-medium block">
                          +${(profit / 100).toFixed(2)} ({margin}%)
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Fittings Calendar Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Fittings Schedule</h2>
            <a href="/craftkoru/appointments" className="text-xs font-medium text-blue-600 hover:text-blue-700">
              Calendar
            </a>
          </div>

          {appointments.length === 0 ? (
            <EmptyState
              title="No upcoming sessions"
              description="Schedule client consultations, first fittings, or alteration trials."
              icon={<Calendar size={32} />}
            />
          ) : (
            <div className="space-y-2">
              {appointments.map((apt) => (
                <Card key={apt.id} className="p-3">
                  <p className="text-sm font-semibold text-slate-900">{apt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" • "}
                    {new Date(apt.startTime).toLocaleDateString()}
                  </p>
                  {apt.staffName && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1.5 inline-block">
                      Artisan: {apt.staffName}
                    </span>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
