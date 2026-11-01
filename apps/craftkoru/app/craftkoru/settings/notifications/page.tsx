import React from "react";
import { Card } from "@shiftslabs/ui";

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notification Settings</h1>
      <Card className="p-6 space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked />
          <span className="text-sm text-slate-700">Email reminders for appointments</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked />
          <span className="text-sm text-slate-700">SMS reminders</span>
        </label>
        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white">Save</button>
        </div>
      </Card>
    </div>
  );
}
