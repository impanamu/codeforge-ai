import {
  CheckCircle2,
  Database,
  FolderGit2,
  BrainCircuit,
  Cpu,
} from "lucide-react";

const items = [
  {
    icon: FolderGit2,
    label: "Repositories",
    value: "12",
  },
  {
    icon: CheckCircle2,
    label: "Indexed Files",
    value: "4,862",
  },
  {
    icon: BrainCircuit,
    label: "Embedding Model",
    value: "BAAI / bge-small-en",
  },
  {
    icon: Database,
    label: "Vector Database",
    value: "pgvector",
  },
  {
    icon: Cpu,
    label: "LLM Provider",
    value: "Gemini Flash",
  },
];

export default function RepositoryHealth() {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#161B22]">
      <div className="border-b border-slate-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          Repository Health
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Current indexing and AI configuration
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2">
                <Icon className="h-4 w-4 text-blue-400" />
              </div>

              <span className="text-sm text-slate-300">
                {label}
              </span>
            </div>

            <span className="text-sm font-medium text-white">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}