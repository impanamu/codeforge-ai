from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.schemas.token import Token
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
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    try:
        token = user_service.login_user(
            db,
            form_data.username,
            form_data.password,
        )

        return Token(
            access_token=token,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password", summary="Send password reset link")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        reset_token = user_service.request_password_reset(db, data.email)
        frontend_reset_url = f"http://localhost:5173/reset-password?token={reset_token}"
        
        # In a real environment with SMTP set up, we attempt to send via SMTP.
        # We also provide reset_link in the JSON response so frontend can show a clickable preview in dev mode.
        return {
            "message": "Password reset link generated successfully.",
            "email": data.email,
            "reset_link": frontend_reset_url,
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/reset-password", summary="Reset password using token")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        user_service.reset_password(db, data.token, data.new_password)
        return {"message": "Password has been reset successfully."}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )