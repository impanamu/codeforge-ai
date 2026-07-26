from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.repository import (
    RepositoryCreate,
    RepositoryDetailResponse,
    RepositoryResponse,
)
from app.services.repository_service import RepositoryService

router = APIRouter(
    prefix="/repositories",
    tags=["Repositories"],
)

repository_service = RepositoryService()


@router.post(
    "",
    response_model=RepositoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_repository(
    repository_data: RepositoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return repository_service.create_repository(
        db,
        repository_data,
        current_user,
    )


@router.get(
    "",
    response_model=list[RepositoryResponse],
)
def get_repositories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return repository_service.get_user_repositories(
        db,
        current_user,
    )


@router.get(
    "/{repository_id}",
    response_model=RepositoryDetailResponse,
)
def get_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return repository_service.get_repository(
            db,
            repository_id,
            current_user,
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )

    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )


@router.delete(
    "/{repository_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = repository_service.delete_repository(
        db,
        repository_id,
        current_user,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )


@router.post("/{repository_id}/index")
def index_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        count = repository_service.index_repository(
            db,
            repository_id,
            current_user,
        )

        return {
            "message": "Repository indexed successfully",
            "chunks": count,
        }

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )

    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )