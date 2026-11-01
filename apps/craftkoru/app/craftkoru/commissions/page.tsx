import React from "react";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Percent, Plus } from "lucide-react";

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commissions</h1>
          <p className="text-sm text-slate-500">Staff commission rules and earnings.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors">
          <Plus size={16} /> Add Rule
        </button>
      </div>
      <EmptyState title="No commission rules" description="Define commission rates per staff or service." icon={<Percent size={36} />} />
    </div>
  );
}
