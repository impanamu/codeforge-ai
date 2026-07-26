from datetime import datetime
from pathlib import Path

from app.models.document_chunk import DocumentChunk
from app.repositories.document_chunk_repository import (
    DocumentChunkRepository,
)
from app.repositories.repository_repository import RepositoryRepository
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.file_service import FileService
from sqlalchemy.orm import Session


class IndexingService:
    BATCH_SIZE = 64

    def __init__(self, db: Session):
        self.db = db

        self.file_service = FileService()
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()

        self.chunk_repository = DocumentChunkRepository(db)
        self.repository_repository = RepositoryRepository()

    def index_repository(self, repository):
        print("=" * 80)
        print(f"Indexing repository: {repository.name}")
        print("=" * 80)

        repository.status = "Indexing"
        self.db.commit()
        self.db.refresh(repository)

        files = self.file_service.get_repository_files(
            repository.local_path
        )

        print(f"Found {len(files)} files")

        self.chunk_repository.delete_repository_chunks(
            repository.id
        )

        all_chunk_records = []
        chunk_texts = []
        total_chunks = 0

        # ---------------------------------------------------
        # Read files
        # ---------------------------------------------------
        for index, file_path in enumerate(files, start=1):

            print(f"[{index}/{len(files)}] {file_path}")

            try:
                text = Path(file_path).read_text(
                    encoding="utf-8",
                    errors="ignore",
                )

                # Remove NULL bytes
                text = (
                    text.replace("\x00", "")
                        .replace("\u0000", "")
                )

                if not text.strip():
                    print("Empty file. Skipping.")
                    continue

                chunks = self.chunking_service.chunk_text(text)

                print(f"Chunks created: {len(chunks)}")

                for chunk in chunks:

                    clean_content = (
                        chunk.content
                        .replace("\x00", "")
                        .replace("\u0000", "")
                    )

                    if not clean_content.strip():
                        continue

                    chunk_texts.append(clean_content)

                    all_chunk_records.append(
                        {
                            "repository_id": repository.id,
                            "file_path": str(file_path),
                            "chunk_index": chunk.chunk_index,
                            "content": clean_content,
                            "start_line": chunk.start_line,
                            "end_line": chunk.end_line,
                        }
                    )

                total_chunks += len(chunks)

            except Exception as e:
                print(f"Skipping file: {file_path}")
                print(e)

        print()
        print("=" * 80)
        print(f"Total chunks: {total_chunks}")
        print("=" * 80)

        # ---------------------------------------------------
        # Generate embeddings
        # ---------------------------------------------------
        embeddings = []

        total_batches = (
            len(chunk_texts) + self.BATCH_SIZE - 1
        ) // self.BATCH_SIZE

        print("Generating embeddings...")

        for batch_number, start in enumerate(
            range(0, len(chunk_texts), self.BATCH_SIZE),
            start=1,
        ):

            batch = chunk_texts[
                start:start + self.BATCH_SIZE
            ]

            print(
                f"Embedding batch "
                f"{batch_number}/{total_batches}"
            )

            try:
                batch_embeddings = (
                    self.embedding_service.generate_embeddings(
                        batch
                    )
                )

                embeddings.extend(batch_embeddings)

            except Exception as e:
                print("Embedding batch failed.")
                print(e)

        print("Embedding generation complete.")

        if len(embeddings) != len(all_chunk_records):
            raise RuntimeError(
                "Embedding count mismatch.\n"
                f"Chunks: {len(all_chunk_records)}\n"
                f"Embeddings: {len(embeddings)}"
            )

        # ---------------------------------------------------
        # Create ORM objects
        # ---------------------------------------------------
        document_chunks = []

        for chunk, embedding in zip(
            all_chunk_records,
            embeddings,
        ):

            content = (
                chunk["content"]
                .replace("\x00", "")
                .replace("\u0000", "")
            )

            if "\x00" in content:
                print("=" * 80)
                print("NULL BYTE DETECTED")
                print(chunk["file_path"])
                print("=" * 80)
                continue

            document_chunks.append(
                DocumentChunk(
                    repository_id=chunk["repository_id"],
                    file_path=chunk["file_path"],
                    chunk_index=chunk["chunk_index"],
                    content=content,
                    start_line=chunk["start_line"],
                    end_line=chunk["end_line"],
                    embedding=embedding,
                )
            )

        print(
            f"Saving {len(document_chunks)} chunks..."
        )

        self.chunk_repository.save_chunks(
            document_chunks
        )

        repository.status = "Indexed"
        repository.indexed_files = len(files)
        repository.indexed_chunks = total_chunks
        repository.last_indexed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(repository)

        print("=" * 80)
        print("Repository indexed successfully!")
        print(f"Files indexed : {repository.indexed_files}")
        print(f"Chunks indexed: {repository.indexed_chunks}")
        print("=" * 80)

        return len(document_chunks)