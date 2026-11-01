import React from "react";
import { AppHeader, MobileBottomNav } from "@shiftslabs/ui";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Ruler,
} from "lucide-react";

export default function CraftkoruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomNavItems = [
    { label: "Overview", href: "/craftkoru/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Jobs", href: "/craftkoru/jobs", icon: <Briefcase size={18} /> },
    { label: "Bookings", href: "/craftkoru/appointments", icon: <Calendar size={18} /> },
    { label: "Clients", href: "/craftkoru/customers", icon: <Users size={18} /> },
    { label: "Invoices", href: "/craftkoru/invoices", icon: <FileText size={18} /> },
  ];

  const subnavItems = [
    { label: "Dashboard", href: "/craftkoru/dashboard" },
    { label: "Custom Jobs", href: "/craftkoru/jobs" },
    { label: "Clients", href: "/craftkoru/customers" },
    { label: "Measurements", href: "/craftkoru/measurements" },
    { label: "Fittings", href: "/craftkoru/fittings" },
    { label: "Appointments", href: "/craftkoru/appointments" },
    { label: "Materials & BOM", href: "/craftkoru/materials" },
    { label: "Invoices", href: "/craftkoru/invoices" },
    { label: "Commissions", href: "/craftkoru/commissions" },
    { label: "Profitability", href: "/craftkoru/reports/profitability" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader appName="Craftkoru" businessName="Personal Services Workspace" />

      {/* Desktop Subnavigation */}
      <nav className="hidden md:flex bg-white border-b border-slate-200 px-6 gap-6 overflow-x-auto text-sm font-medium text-slate-600">
        {subnavItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="py-3 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors whitespace-nowrap"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav items={bottomNavItems} />
    </div>
  );
}
