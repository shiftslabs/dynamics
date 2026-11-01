import React from "react";
import { cn } from "./utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export interface MobileBottomNavProps {
  items: NavItem[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ items }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors",
              item.isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className="h-5 w-5 mb-1 flex items-center justify-center">{item.icon}</div>
            <span className="truncate max-w-[64px]">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export interface AppHeaderProps {
  appName: string;
  businessName?: string;
  userEmail?: string;
  activeAppSlug?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  businessName,
  userEmail,
  activeAppSlug,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-blue-700 transition-colors">
            S
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">
            {appName}
          </span>
        </a>
        {businessName && (
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              {businessName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="text-xs text-slate-500 hidden md:inline-block">
            {userEmail}
          </span>
        )}
        <a
          href="/workspace"
          className="text-xs text-blue-600 font-medium hover:text-blue-700 px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
        >
          Dynamicslabs Hub
        </a>
      </div>
    </header>
  );
};

export interface UsageMeterProps {
  label: string;
  usedBytesOrCount: number;
  limitBytesOrCount: number;
  unit: "MB" | "GB" | "queries";
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  label,
  usedBytesOrCount,
  limitBytesOrCount,
  unit,
}) => {
  const percentage = Math.min(
    100,
    Math.round((usedBytesOrCount / (limitBytesOrCount || 1)) * 100)
  );

  let formattedUsed = usedBytesOrCount.toString();
  let formattedLimit = limitBytesOrCount.toString();

  if (unit === "MB") {
    formattedUsed = (usedBytesOrCount / (1024 * 1024)).toFixed(1);
    formattedLimit = (limitBytesOrCount / (1024 * 1024)).toFixed(0);
  } else if (unit === "GB") {
    formattedUsed = (usedBytesOrCount / (1024 * 1024 * 1024)).toFixed(2);
    formattedLimit = (limitBytesOrCount / (1024 * 1024 * 1024)).toFixed(0);
  }

  const isWarning = percentage >= 80;
  const isDanger = percentage >= 95;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">
          {formattedUsed} / {formattedLimit} {unit} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-blue-600"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
