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
    { label: "Dashboard", href: "/craftkoru/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Custom Jobs", href: "/craftkoru/jobs", icon: <Briefcase size={18} /> },
    { label: "Clients", href: "/craftkoru/customers", icon: <Users size={18} /> },
    { label: "Measurements", href: "/craftkoru/measurements", icon: <Ruler size={18} /> },
    { label: "Fittings", href: "/craftkoru/fittings", icon: <Layers size={18} /> },
    { label: "Appointments", href: "/craftkoru/appointments", icon: <Calendar size={18} /> },
    { label: "Materials & BOM", href: "/craftkoru/materials", icon: <Layers size={18} /> },
    { label: "Invoices", href: "/craftkoru/invoices", icon: <FileText size={18} /> },
    { label: "Commissions", href: "/craftkoru/commissions", icon: <DollarSign size={18} /> },
    { label: "Profitability", href: "/craftkoru/reports/profitability", icon: <DollarSign size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader appName="Craftkoru" businessName="Personal Services Workspace" />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] sticky top-0">
          <nav className="flex flex-col gap-1 p-3 text-sm font-medium text-slate-600">
            {subnavItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav items={bottomNavItems} />
    </div>
  );
}
" filePath="C:\Users\USER\OneDrive\Documents\dynamics\apps\craftkoru\app\craftkoru\layout.tsx"