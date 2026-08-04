from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    def register_user(
        self,
        db: Session,
        user_data: UserCreate,
    ) -> User:

        existing_user = self.repository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError("Email already registered.")

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hash_password(
                user_data.password
            ),
        )

        return self.repository.create(
            db,
            user,
        )

    def login_user(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> str:

        user = self.repository.get_by_email(
            db,
            email,
        )

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password.")

        return create_access_token(
            subject=user.email,
        )

    def request_password_reset(
        self,
        db: Session,
        email: str,
    ) -> str:
        user = self.repository.get_by_email(db, email)
        if not user:
            # We still return a valid token for dev mode / security consistency
            return create_access_token(subject=email, expires_minutes=15)
        
        return create_access_token(subject=user.email, expires_minutes=15)

    def reset_password(
        self,
        db: Session,
        token: str,
        new_password: str,
    ) -> bool:
        from app.core.jwt import decode_access_token
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise ValueError("Invalid or expired reset token.")

        user = self.repository.get_by_email(db, email)
        if not user:
            raise ValueError("User not found.")

        user.password_hash = hash_password(new_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return True