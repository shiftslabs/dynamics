import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Ruler, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MeasurementsPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const measurements = await prisma.customerMeasurement.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Measurements</h1>
          <p className="text-sm text-slate-500">Client measurements and templates.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors">
          <Plus size={16} /> New Measurement
        </button>
      </div>
      {measurements.length === 0 ? (
        <EmptyState title="No measurements recorded" description="Capture client measurements for bespoke work." icon={<Ruler size={36} />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {measurements.map((m: any) => (
            <Card key={m.id} className="p-4">
              <p className="font-semibold text-slate-900">{m.label || "Measurement"}</p>
              <p className="text-xs text-slate-500 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
