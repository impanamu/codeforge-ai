from sqlalchemy.orm import Session

from app.models.repository import Repository
from app.models.user import User
from app.repositories.repository_repository import RepositoryRepository
from app.schemas.repository import RepositoryCreate
from app.services.git_service import GitService
from app.services.indexing_service import IndexingService


class RepositoryService:
    def __init__(self):
        self.repository_repository = RepositoryRepository()
        self.git_service = GitService()

    def create_repository(
        self,
        db: Session,
        repository_data: RepositoryCreate,
        user: User,
    ) -> Repository:
        # Clone the repository using GitService
        local_path = self.git_service.clone_repository(
            repository_data.github_url,
            repository_data.default_branch,
        )

        # Create a new Repository instance
        new_repository = Repository(
            name=repository_data.name,
            github_url=repository_data.github_url,
            default_branch=repository_data.default_branch,
            local_path=local_path,
            user_id=user.id,
        )

        # Save the new repository to the database
        return self.repository_repository.create(
            db,
            new_repository,
        )

    def get_user_repositories(
        self,
        db: Session,
        user: User,
    ) -> list[Repository]:
        return self.repository_repository.get_all_by_user(
            db,
            user.id,
        )

    def delete_repository(
        self,
        db: Session,
        repository_id: int,
        user: User,
    ) -> bool:
        repository = self.repository_repository.get_by_id(
            db,
            repository_id,
        )

        if repository is None:
            return False

        if repository.user_id != user.id:
            return False

        self.repository_repository.delete(
            db,
            repository,
        )

        return True

    def index_repository(
        self,
        db: Session,
        repository_id: int,
        user: User,
    ) -> int:
        repository = self.repository_repository.get_by_id(
            db,
            repository_id,
        )

        if repository is None:
            raise ValueError("Repository not found")

        if repository.user_id != user.id:
            raise PermissionError("Not authorized")

        indexing_service = IndexingService(db)

        return indexing_service.index_repository(repository)