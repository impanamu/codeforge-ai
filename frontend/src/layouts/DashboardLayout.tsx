import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";
import { LayoutProvider } from "@/context/LayoutContext";

export default function DashboardLayout() {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen items-stretch bg-[#0D1117] text-slate-100">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />

          <main className="flex-1 bg-[#0D1117] px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}