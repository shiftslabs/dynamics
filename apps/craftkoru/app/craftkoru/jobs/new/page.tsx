import React from "react";
import { Card } from "@shiftslabs/ui";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NewJobPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <a href="/craftkoru/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
        <ArrowLeft size={14} /> Back to jobs
      </a>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Bespoke Job</h1>
        <p className="text-sm text-slate-500">Define service, materials, labour and pricing.</p>
      </div>
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Job title</label>
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="e.g. Custom evening gown" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Client</label>
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Search client" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Service price (minor units)</label>
            <input type="number" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Due date</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 text-sm rounded-lg border border-slate-200">Cancel</button>
          <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white">Create Job</button>
        </div>
      </Card>
    </div>
  );
}
