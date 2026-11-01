import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Users, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnvilgridCustomersPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "anvilgrid" } });
  const businessId = business?.id || "default";
  const customers = await prisma.customer.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers & Sites</h1><p className="text-sm text-slate-500">Customer records and service locations.</p></div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors"><Plus size={16} /> New Customer</button>
      </div>
      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Add customers and their sites." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c: any) => (
            <Card key={c.id} className="p-4">
              <p className="font-semibold text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-500 mt-1">{c.phone || c.email || "No contact"}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
