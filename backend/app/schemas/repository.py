from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RepositoryCreate(BaseModel):
    name: str
    github_url: str
    default_branch: str = "main"


class RepositoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    github_url: str
    default_branch: str
    local_path: str

    status: str
    indexed_files: int
    indexed_chunks: int
    last_indexed_at: datetime | None


class RepositoryDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    github_url: str
    default_branch: str
    local_path: str

    status: str
    indexed_files: int
    indexed_chunks: int
    last_indexed_at: datetime | None