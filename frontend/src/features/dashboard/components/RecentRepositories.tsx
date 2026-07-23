import {
  FolderGit2,
  ExternalLink,
} from "lucide-react";

const repositories = [
  {
    id: 1,
    name: "CodeForge Backend",
    language: "Python",
    status: "Indexed",
    updated: "2 mins ago",
  },
  {
    id: 2,
    name: "CodeForge Frontend",
    language: "React",
    status: "Indexed",
    updated: "8 mins ago",
  },
  {
    id: 3,
    name: "Portfolio",
    language: "Next.js",
    status: "Processing",
    updated: "Just now",
  },
];

export default function RecentRepositories() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#161B22]">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Recent Repositories
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Recently indexed repositories
          </p>
        </div>

        <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
          View all
        </button>
      </div>

      <table className="w-full">
        <thead className="bg-slate-900/40">
          <tr className="text-left text-sm text-slate-400">
            <th className="px-6 py-3">Repository</th>
            <th>Language</th>
            <th>Status</th>
            <th>Last Indexed</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {repositories.map((repo) => (
            <tr
              key={repo.id}
              className="border-t border-slate-800 transition-colors hover:bg-slate-800/40"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <FolderGit2 className="h-5 w-5 text-blue-400" />

                  <span className="font-medium text-white">
                    {repo.name}
                  </span>
                </div>
              </td>

              <td className="text-slate-300">
                {repo.language}
              </td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    repo.status === "Indexed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {repo.status}
                </span>
              </td>

              <td className="text-slate-400">
                {repo.updated}
              </td>

              <td className="pr-6 text-right">
                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}