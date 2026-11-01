import React from "react";
import { Card } from "@shiftslabs/ui";

export default function BookingSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Booking Settings</h1>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Booking window (days)</label>
          <input type="number" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" defaultValue={30} />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white">Save</button>
        </div>
      </Card>
    </div>
  );
}
