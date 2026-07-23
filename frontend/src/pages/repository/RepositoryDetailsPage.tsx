import { useParams } from "react-router-dom";

import RepositoryActionsCard from "@/components/repository/RepositoryActionsCard";
import RepositoryHeader from "@/components/repository/RepositoryHeader";
import RepositoryInfoCard from "@/components/repository/RepositoryInfoCard";
import RepositoryStatsCard from "@/components/repository/RepositoryStatsCard";
import { useRepository } from "@/hooks/useRepository";

export default function RepositoryDetailsPage() {
  const { id } = useParams();

  const repositoryId = Number(id);

  const {
    data: repository,
    isLoading,
    isError,
  } = useRepository(repositoryId);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-400">
          Loading repository...
        </p>
      </div>
    );
  }

  if (isError || !repository) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-red-500">
          Failed to load repository.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <RepositoryHeader
        name={repository.name}
      />

      <RepositoryInfoCard
        githubUrl={repository.github_url}
        defaultBranch={repository.default_branch}
        localPath={repository.local_path}
      />

      <RepositoryStatsCard
        repository={repository}
      />

      <RepositoryActionsCard />
    </div>
  );
}