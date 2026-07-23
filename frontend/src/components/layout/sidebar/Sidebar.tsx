import {
  Bot,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Settings,
  BarChart3,
  Sparkles,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import { useLayout } from "@/context/LayoutContext";

export default function Sidebar() {
  const { collapsed } = useLayout();

  return (
    <aside
      className={`sticky top-0 self-stretch min-h-screen shrink-0 flex flex-col border-r border-slate-800 bg-[#161B22] transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="border-b border-slate-800 px-4 py-5">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="truncate text-lg font-semibold text-white">
                CodeForge AI
              </h1>

              <p className="text-xs text-slate-400">
                AI Developer Platform
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-4">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          to="/dashboard"
          collapsed={collapsed}
        />

        <SidebarItem
          icon={FolderGit2}
          label="Repositories"
          to="/repositories"
          collapsed={collapsed}
        />

        <SidebarItem
          icon={Bot}
          label="Chat"
          to="/chat"
          collapsed={collapsed}
        />

        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          to="/analytics"
          collapsed={collapsed}
        />

        <SidebarItem
          icon={Settings}
          label="Settings"
          to="/settings"
          collapsed={collapsed}
        />
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-3">
        {!collapsed && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              I
            </div>

            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                Impana
              </p>

              <p className="truncate text-xs text-slate-400">
                Software Engineer
              </p>
            </div>
          </div>
        )}

        <button
          className={`flex w-full items-center rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}