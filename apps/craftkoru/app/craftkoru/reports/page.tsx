import React from "react";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">reports</h1>
      </div>
      <EmptyState title="No data yet" description="Create your first record to get started." />
    </div>
  );
}
