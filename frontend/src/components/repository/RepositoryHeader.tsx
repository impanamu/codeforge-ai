import { ArrowLeft, FolderGit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface RepositoryHeaderProps {
  name: string;
}

export default function RepositoryHeader({
  name,
}: RepositoryHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => navigate("/dashboard")}
        className="gap-2 border border-slate-700 bg-slate-900 hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/15">
            <FolderGit2 className="h-7 w-7 text-blue-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              {name}
            </h1>

            <p className="mt-2 text-slate-400">
              Repository Details
            </p>
          </div>
        </div>
      </div>
    </>
  );
}