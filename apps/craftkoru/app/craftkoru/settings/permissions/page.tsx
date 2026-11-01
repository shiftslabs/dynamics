import React from "react";
import { Card } from "@shiftslabs/ui";

export default function PermissionsSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Permissions</h1>
      <Card className="p-6 space-y-4">
        <p className="text-sm text-slate-500">Role-based access for staff and managers.</p>
        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white">Save</button>
        </div>
      </Card>
    </div>
  );
}
