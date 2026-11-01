import React from "react";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Users, Plus } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff</h1>
          <p className="text-sm text-slate-500">Team members and roles.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors">
          <Plus size={16} /> Invite Staff
        </button>
      </div>
      <EmptyState title="No staff members" description="Invite team members to collaborate." icon={<Users size={36} />} />
    </div>
  );
}
