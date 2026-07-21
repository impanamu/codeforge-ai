from sqlalchemy.orm import Session

from app.repositories.search_repository import SearchRepository
from app.services.embedding_service import EmbeddingService


class SearchService:
    def __init__(self, db: Session):
        self.embedding_service = EmbeddingService()
        self.search_repository = SearchRepository(db)

    def search(
        self,
        repository_id: int,
        question: str,
    ):
        embedding = self.embedding_service.generate_embedding(
            question
        )

        results = self.search_repository.search(
            repository_id=repository_id,
            embedding=embedding,
        )

        return results