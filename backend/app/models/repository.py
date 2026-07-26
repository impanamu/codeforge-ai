from datetime import datetime

from app.models.base import BaseModel
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Repository(BaseModel):
    __tablename__ = "repositories"

    name: Mapped[str] = mapped_column(String(255))

    github_url: Mapped[str] = mapped_column(String(500))

    default_branch: Mapped[str] = mapped_column(
        String(100),
        default="main",
    )

    local_path: Mapped[str] = mapped_column(String(500))

    status: Mapped[str] = mapped_column(
        String(50),
        default="Not Indexed",
    )

    indexed_chunks: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    indexed_files: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    last_indexed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
    )

    user = relationship(
        "User",
        back_populates="repositories",
    )

    document_chunks = relationship(
        "DocumentChunk",
        back_populates="repository",
        cascade="all, delete-orphan",
    )