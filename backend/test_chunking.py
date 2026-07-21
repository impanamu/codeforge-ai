from pathlib import Path

from app.services.chunking_service import ChunkingService

text = Path("repositories/main/README.md").read_text()

service = ChunkingService()

chunks = service.chunk_text(text)

print(f"Chunks: {len(chunks)}")

for chunk in chunks:
    print("-" * 40)
    print(
        f"Chunk {chunk.chunk_index} "
        f"({chunk.start_line}-{chunk.end_line})"
    )
    print(chunk.content[:150])