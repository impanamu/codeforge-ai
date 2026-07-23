import type { Repository } from "@/api/repositories";

interface RepositoryStatsCardProps {
  repository: Repository;
}

export default function RepositoryStatsCard({
  repository,
}: RepositoryStatsCardProps) {
  const lastIndexed = repository.last_indexed_at
    ? new Date(repository.last_indexed_at).toLocaleString()
    : "Never";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Repository Statistics
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Status
          </p>

          <p className="mt-2 text-2xl font-bold text-green-400">
            {repository.status}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Indexed Files
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {repository.indexed_files}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Indexed Chunks
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {repository.indexed_chunks}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Last Indexed
          </p>

          <p className="mt-2 text-sm font-medium text-white break-words">
            {lastIndexed}
          </p>
        </div>
      </div>
    </div>
  );
}