from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.token import Token
from app.schemas.user import UserLogin

from app.dependencies.db import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Authentication"])

user_service = UserService()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        return user_service.register_user(db, user)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.post(
    "/login",
    response_model=Token,
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        token = user_service.login_user(
            db,
            credentials.email,
            credentials.password,
        )

        return Token(
            access_token=token,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )        