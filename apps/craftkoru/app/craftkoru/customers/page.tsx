import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState, Input, Button } from "@shiftslabs/ui";
import { Users, Search, Plus, Phone, Mail, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const customers = await prisma.customer.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500">Measurements, history, fittings and balances.</p>
        </div>
        <a href="/craftkoru/customers/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors">
          <Plus size={16} /> New Client
        </a>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search clients by name, phone or email" className="pl-9" />
        </div>
      </div>

      {customers.length === 0 ? (
        <EmptyState title="No clients yet" description="Add your first client to track measurements, jobs and invoices." actionText="Add Client" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <Card key={c.id} hoverable className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {(c.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">{c.email || c.phone || "No contact"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                {c.phone && <span className="flex items-center gap-1"><Phone size={12} />{c.phone}</span>}
                {c.email && <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>}
                {c.address && <span className="flex items-center gap-1"><MapPin size={12} />{c.address}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

