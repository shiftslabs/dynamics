import React from "react";
import { prisma } from "@shiftslabs/database";
import { Card, EmptyState } from "@shiftslabs/ui";
import { Calendar, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const appointments = await prisma.appointment.findMany({ where: { businessId }, orderBy: { startTime: "asc" }, take: 50 }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">Bookings, fittings and consultations.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-xs transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>
      {appointments.length === 0 ? (
        <EmptyState title="No appointments scheduled" description="Book consultations and fittings with clients." icon={<Calendar size={36} />} />
      ) : (
        <div className="space-y-3">
          {appointments.map((a: any) => (
            <Card key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{a.title}</p>
                <p className="text-xs text-slate-500">{new Date(a.startTime).toLocaleString()}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{a.status}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
