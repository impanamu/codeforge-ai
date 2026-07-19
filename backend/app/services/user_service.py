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