import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Package, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const materials = await prisma.product.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Materials & BOM</h1>
          <p className="text-sm text-slate-500">Fabric, accessories and recipes.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors">
          <Plus size={16} /> Add Material
        </button>
      </div>
      {materials.length === 0 ? (
        <EmptyState title="No materials yet" description="Add fabrics and accessories to track stock and cost." icon={<Package size={36} />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m: any) => (
            <Card key={m.id} className="p-4">
              <p className="font-semibold text-slate-900">{m.name}</p>
              <p className="text-xs text-slate-500 mt-1">Type: {m.type}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

