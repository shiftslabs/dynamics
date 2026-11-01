import React from "react";
import { Card } from "@shiftslabs/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Business profile, booking and notifications.</p>
      </div>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Business name</label>
          <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Timezone</label>
          <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Africa/Lagos" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Currency</label>
          <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="NGN" />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white">Save</button>
        </div>
      </Card>
    </div>
  );
}
