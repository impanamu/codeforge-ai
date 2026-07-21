from dataclasses import dataclass


@dataclass
class DocumentChunk:
    content: str
    chunk_index: int
    start_line: int
    end_line: int


class ChunkingService:
    def __init__(
        self,
        chunk_size: int = 80,
        overlap: int = 20,
    ):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str) -> list[DocumentChunk]:
        lines = text.splitlines()

        chunks = []

        start = 0
        chunk_index = 0

        while start < len(lines):
            end = min(start + self.chunk_size, len(lines))

            chunk = DocumentChunk(
                content="\n".join(lines[start:end]),
                chunk_index=chunk_index,
                start_line=start + 1,
                end_line=end,
            )

            chunks.append(chunk)

            if end == len(lines):
                break

            start += self.chunk_size - self.overlap
            chunk_index += 1

        return chunks