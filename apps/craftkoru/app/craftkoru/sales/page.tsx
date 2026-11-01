import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Receipt, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const sales = await prisma.sale.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales</h1>
          <p className="text-sm text-slate-500">Recorded sales and receipts.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors">
          <Plus size={16} /> Record Sale
        </button>
      </div>
      {sales.length === 0 ? (
        <EmptyState title="No sales recorded" description="Sales will appear here once transactions are made." icon={<Receipt size={36} />} />
      ) : (
        <div className="space-y-3">
          {sales.map((s: any) => (
            <Card key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Sale #{s.id.slice(0, 8)}</p>
                <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</p>
              </div>
              <p className="font-bold text-slate-900">${((s.totalCents || 0) / 100).toFixed(2)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
