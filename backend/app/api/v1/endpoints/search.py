from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.search import SearchRequest, SearchResponse, SearchResult
from app.services.search_service import SearchService

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post(
    "/{repository_id}",
    response_model=SearchResponse,
)
def search_repository(
    repository_id: int,
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SearchService(db)

    chunks = service.search(
        repository_id,
        request.question,
    )

    return SearchResponse(
        results=[
            SearchResult(
                file_path=item.file_path,
                start_line=item.start_line,
                end_line=item.end_line,
                content=item.content,
                score=item.score,
                highlights=item.highlights,
            )
            for item in chunks
        ]
    )