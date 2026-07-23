import { Cpu } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#161B22] p-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Welcome back, Impana 👋
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Manage your repositories, chat with AI, and monitor indexing from one place.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-green-500"></div>

        <Cpu className="h-5 w-5 text-blue-400" />

        <div>
          <p className="text-sm font-medium text-white">
            AI Status
          </p>

          <p className="text-xs text-slate-400">
            Online
          </p>
        </div>
      </div>
    </div>
  );
}