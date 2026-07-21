from pathlib import Path

from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.repositories.document_chunk_repository import (
    DocumentChunkRepository,
)
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.file_service import FileService


class IndexingService:
    def __init__(self, db: Session):
        self.db = db

        self.file_service = FileService()
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()

        self.chunk_repository = DocumentChunkRepository(db)

    def index_repository(
        self,
        repository,
    ):
        files = self.file_service.get_repository_files(
            repository.local_path,
        )

        print(f"Found {len(files)} files")

        self.chunk_repository.delete_repository_chunks(
            repository.id
        )

        total_chunks = 0
        document_chunks = []

        for file_path in files:
            try:
                text = Path(file_path).read_text(
                    encoding="utf-8",
                    errors="ignore",
                )

                chunks = self.chunking_service.chunk_text(text)

                embeddings = self.embedding_service.generate_embeddings(
                    [chunk.content for chunk in chunks]
                )

                for chunk, embedding in zip(chunks, embeddings):
                    document_chunks.append(
                        DocumentChunk(
                            repository_id=repository.id,
                            file_path=str(file_path),
                            chunk_index=chunk.chunk_index,
                            content=chunk.content,
                            start_line=chunk.start_line,
                            end_line=chunk.end_line,
                            embedding=embedding,
                        )
                    )

                total_chunks += len(chunks)

            except Exception as e:
                print(f"Skipping {file_path}: {e}")

        print(f"\nTotal chunks: {total_chunks}")

        self.chunk_repository.save_chunks(document_chunks)

        print(f"Saved {len(document_chunks)} chunks.")

        return len(document_chunks)