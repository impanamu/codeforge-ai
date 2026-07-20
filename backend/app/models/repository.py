from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Repository(BaseModel):
    __tablename__ = "repositories"

    name: Mapped[str] = mapped_column(String(255))

    github_url: Mapped[str] = mapped_column(String(500))

    default_branch: Mapped[str] = mapped_column(
        String(100),
        default="main",
    )

    local_path: Mapped[str] = mapped_column(String(500))

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
    )

    user = relationship(
        "User",
        back_populates="repositories",
    )