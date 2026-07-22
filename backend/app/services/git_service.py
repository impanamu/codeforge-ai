from pathlib import Path

from git import Repo


class GitService:
    def __init__(self):
        self.base_path = Path("repositories")
        self.base_path.mkdir(exist_ok=True)

    def clone_repository(
        self,
        github_url: str,
    ) -> str:
        repository_name = (
            github_url.rstrip("/")
            .split("/")[-1]
            .replace(".git", "")
        )

        repo_path = self.base_path / repository_name

        if repo_path.exists():
            return str(repo_path)

        Repo.clone_from(
            github_url,
            repo_path,
        )

        return str(repo_path)