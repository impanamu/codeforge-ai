import re
from sqlalchemy.orm import Session

from app.repositories.search_repository import SearchRepository
from app.services.embedding_service import EmbeddingService

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
    "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will",
    "with", "how", "what", "where", "which", "who", "why", "can", "find", "show",
    "me", "get", "do", "does", "code", "file", "logic", "function", "handled", "handling"
}


class SearchResultItem:
    """Wrapper class so callers can access attributes directly (e.g. .file_path, .content, .score)."""

    def __init__(self, chunk, score: float, highlights: list[str]):
        self.chunk = chunk
        self.file_path = chunk.file_path
        self.start_line = chunk.start_line
        self.end_line = chunk.end_line
        self.content = chunk.content
        self.score = score
        self.highlights = highlights


class SearchService:
    def __init__(self, db: Session):
        self.embedding_service = EmbeddingService()
        self.search_repository = SearchRepository(db)

    def extract_keywords(self, text: str) -> list[str]:
        tokens = re.findall(r"\b[a-zA-Z0-9_]+\b", text.lower())
        keywords = [t for t in tokens if len(t) > 2 and t not in STOP_WORDS]
        # Preserve order while deduplicating
        seen = set()
        unique = []
        for kw in keywords:
            if kw not in seen:
                seen.add(kw)
                unique.append(kw)
        return unique

    def search(
        self,
        repository_id: int,
        question: str,
        limit: int = 6,
    ) -> list[SearchResultItem]:
        embedding = self.embedding_service.generate_embedding(question)
        keywords = self.extract_keywords(question)

        candidates = self.search_repository.search(
            repository_id=repository_id,
            embedding=embedding,
            keywords=keywords,
        )

        results = []
        question_lower = question.lower().strip()

        for chunk, distance in candidates:
            # Cosine distance in pgvector is in [0, 2]. Similarity = max(0, 1 - distance)
            vec_sim = max(0.0, min(1.0, 1.0 - distance))

            content_lower = chunk.content.lower()
            file_path_lower = chunk.file_path.lower()

            matched_terms = []
            kw_hits = 0
            file_path_hit = False

            for kw in keywords:
                in_content = kw in content_lower
                in_path = kw in file_path_lower
                if in_content or in_path:
                    matched_terms.append(kw)
                    kw_hits += 1
                if in_path:
                    file_path_hit = True

            kw_ratio = (kw_hits / len(keywords)) if keywords else 0.0
            phrase_bonus = 0.15 if (len(question_lower) > 4 and question_lower in content_lower) else 0.0
            path_bonus = 0.2 if file_path_hit else 0.0

            kw_score = min(1.0, kw_ratio + path_bonus + phrase_bonus)

            # Hybrid score: 65% vector similarity + 35% exact keyword matching
            if keywords:
                hybrid_score = (vec_sim * 0.65) + (kw_score * 0.35)
            else:
                hybrid_score = vec_sim

            # Filter out chunks with low hybrid relevance score (< 0.20) unless keywords explicitly matched
            if hybrid_score < 0.20 and not matched_terms:
                continue

            results.append(
                SearchResultItem(
                    chunk=chunk,
                    score=round(hybrid_score * 100, 1),
                    highlights=matched_terms,
                )
            )

        # Rank results by hybrid score descending
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:limit]