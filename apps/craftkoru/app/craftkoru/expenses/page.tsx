import React from "react";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Wallet, Plus } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500">Business expenses and categories.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors">
          <Plus size={16} /> Add Expense
        </button>
      </div>
      <EmptyState title="No expenses recorded" description="Track rent, utilities and supplies." icon={<Wallet size={36} />} />
    </div>
  );
}
