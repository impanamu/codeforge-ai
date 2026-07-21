from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/repositories",
    tags=["Chat"],
)


@router.post(
    "/{repository_id}/chat",
    response_model=ChatResponse,
)
def chat(
    repository_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat_service = ChatService(db)   # ✅ Create it here using db

    response = chat_service.chat(
        repository_id=repository_id,
        question=request.question,
    )

    return ChatResponse(**response)