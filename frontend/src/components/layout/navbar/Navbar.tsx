import {
  Bell,
  Menu,
  Moon,
  RefreshCw,
  Search,
} from "lucide-react";

import { useLayout } from "@/context/LayoutContext";

export default function Navbar() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-800 bg-[#0D1117]/90 px-8 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-5">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Manage your AI workspace
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden lg:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            placeholder="Search repositories, files, symbols..."
            className="h-11 w-[430px] rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-16 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Sync */}
        <button
          title="Sync Workspace"
          className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all duration-200 hover:border-blue-500 hover:text-blue-400"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all duration-200 hover:border-blue-500 hover:text-white"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* Theme Toggle */}
        <button
          title="Toggle Theme"
          className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all duration-200 hover:border-yellow-500 hover:text-yellow-400"
        >
          <Moon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}