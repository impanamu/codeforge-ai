import {
  GitBranch,
  Bot,
  Database,
  Clock,
} from "lucide-react";

const activities = [
  {
    icon: GitBranch,
    title: "Indexed Backend API",
    time: "2 minutes ago",
  },
  {
    icon: Database,
    title: "Generated embeddings",
    time: "8 minutes ago",
  },
  {
    icon: Bot,
    title: 'Asked "Explain JWT Authentication"',
    time: "18 minutes ago",
  },
  {
    icon: Clock,
    title: "Repository synchronized",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#161B22]">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest events from your workspace
          </p>
        </div>

        <button className="text-sm text-blue-400 hover:text-blue-300">
          View all
        </button>
      </div>

      <div className="divide-y divide-slate-800">
        {activities.map(({ icon: Icon, title, time }) => (
          <div
            key={title}
            className="flex items-center gap-4 px-6 py-4"
          >
            <div className="rounded-lg bg-slate-800 p-2">
              <Icon className="h-4 w-4 text-blue-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-white">{title}</p>

              <p className="mt-1 text-xs text-slate-500">
                {time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}