import { BadgeCheck, FolderGit2, Files, Clock3 } from "lucide-react";

interface Props {
  repositoryName?: string;
  fileCount?: number;
  indexedAt?: string;
}

export function ChatHeader({
  repositoryName = "CodeForge Backend",
  fileCount = 142,
  indexedAt = "2 minutes ago",
}: Props) {
  return (
    <div className="border-b bg-card px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <FolderGit2 className="h-7 w-7 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {repositoryName}
            </h2>

            <p className="mt-1 text-muted-foreground">
              Ask anything about this repository
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Files size={16} />
                {fileCount} Files
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                Indexed {indexedAt}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <BadgeCheck size={18} />
          Indexed
        </div>
      </div>
    </div>
  );
}