import { FolderOpen, GitBranch, Globe } from "lucide-react";

interface RepositoryInfoCardProps {
  githubUrl: string;
  defaultBranch: string;
  localPath: string;
}

export default function RepositoryInfoCard({
  githubUrl,
  defaultBranch,
  localPath,
}: RepositoryInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Repository Information
      </h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Globe className="mt-1 h-5 w-5 text-blue-400" />

          <div>
            <p className="text-sm text-slate-400">
              GitHub URL
            </p>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-blue-400 hover:underline"
            >
              {githubUrl}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <GitBranch className="mt-1 h-5 w-5 text-emerald-400" />

          <div>
            <p className="text-sm text-slate-400">
              Default Branch
            </p>

            <p className="text-white">
              {defaultBranch}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FolderOpen className="mt-1 h-5 w-5 text-amber-400" />

          <div>
            <p className="text-sm text-slate-400">
              Local Repository Path
            </p>

            <p className="break-all font-mono text-white">
              {localPath}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}