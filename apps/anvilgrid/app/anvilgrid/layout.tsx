import React from "react";
import { AppHeader, MobileBottomNav } from "@shiftslabs/ui";
import { LayoutDashboard, Wrench, Users, Calendar, Package, FileText } from "lucide-react";

export default function AnvilgridLayout({ children }: { children: React.ReactNode }) {
  const bottomNavItems = [
    { label: "Overview", href: "/anvilgrid/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Jobs", href: "/anvilgrid/jobs", icon: <Wrench size={18} /> },
    { label: "Clients", href: "/anvilgrid/customers", icon: <Users size={18} /> },
    { label: "Parts", href: "/anvilgrid/parts", icon: <Package size={18} /> },
    { label: "Invoices", href: "/anvilgrid/invoices", icon: <FileText size={18} /> },
  ];
  const subnavItems = [
    { label: "Dashboard", href: "/anvilgrid/dashboard" },
    { label: "Jobs", href: "/anvilgrid/jobs" },
    { label: "Estimates", href: "/anvilgrid/estimates" },
    { label: "Customers", href: "/anvilgrid/customers" },
    { label: "Assets", href: "/anvilgrid/assets" },
    { label: "Parts", href: "/anvilgrid/parts" },
    { label: "Inventory", href: "/anvilgrid/inventory" },
    { label: "Invoices", href: "/anvilgrid/invoices" },
    { label: "Reports", href: "/anvilgrid/reports" },
    { label: "Settings", href: "/anvilgrid/settings" },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader appName="Anvilgrid" businessName="Trades & Repair Workspace" />
      <nav className="hidden md:flex bg-white border-b border-slate-200 px-6 gap-6 overflow-x-auto text-sm font-medium text-slate-600">
        {subnavItems.map((item, idx) => (
          <a key={idx} href={item.href} className="py-3 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors whitespace-nowrap">{item.label}</a>
        ))}
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      <MobileBottomNav items={bottomNavItems} />
    </div>
  );
}
