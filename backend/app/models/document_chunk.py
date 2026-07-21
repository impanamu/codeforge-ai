from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class DocumentChunk(BaseModel):
    __tablename__ = "document_chunks"

    repository_id: Mapped[int] = mapped_column(
        ForeignKey("repositories.id", ondelete="CASCADE"),
    )

    file_path: Mapped[str] = mapped_column(
        String(500),
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
    )

    content: Mapped[str] = mapped_column(
        Text,
    )

    start_line: Mapped[int] = mapped_column(
        Integer,
    )

    end_line: Mapped[int] = mapped_column(
        Integer,
    )

    embedding: Mapped[list[float]] = mapped_column(
        Vector(384),
    )

    repository = relationship(
        "Repository",
        back_populates="document_chunks",
    )