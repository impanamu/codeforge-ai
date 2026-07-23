import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  collapsed: boolean;
}

export default function SidebarItem({
  icon: Icon,
  label,
  to,
  collapsed,
}: SidebarItemProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={clsx(
            "flex h-10 items-center rounded-lg transition-all duration-200",
            collapsed ? "justify-center" : "gap-3 px-3",
            isActive
              ? "border-l-2 border-blue-500 bg-slate-800 text-white"
              : "border-l-2 border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">
              {label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}