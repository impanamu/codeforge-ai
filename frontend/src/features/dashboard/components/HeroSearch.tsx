import { Bot, SendHorizontal } from "lucide-react";

export default function HeroSearch() {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#161B22] p-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <Bot className="h-5 w-5 text-white" />
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Ask CodeForge
            </h2>
          </div>

          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Ask questions about your indexed repositories, generate code,
            explain bugs, or understand your project architecture.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
          ● AI Online
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <input
          type="text"
          placeholder="Ask anything about your repositories..."
          className="h-12 flex-1 rounded-lg border border-slate-700 bg-[#0D1117] px-4 text-white outline-none transition-colors focus:border-blue-500"
        />

        <button className="flex h-12 items-center gap-2 rounded-lg bg-blue-600 px-6 font-medium text-white transition-colors hover:bg-blue-700">
          <SendHorizontal className="h-4 w-4" />
          Ask AI
        </button>
      </div>
    </section>
  );
}