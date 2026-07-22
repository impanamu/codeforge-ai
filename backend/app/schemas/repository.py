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


class RepositoryDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    github_url: str
    default_branch: str
    local_path: str