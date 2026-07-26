from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.repositories import router as repositories_router
from app.api.v1.endpoints.search import router as search_router
from app.api.v1.endpoints.chat import router as chat_router
from app.api.v1.endpoints.oauth import router as oauth_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(oauth_router)
api_router.include_router(search_router)
api_router.include_router(chat_router)
api_router.include_router(users_router)
api_router.include_router(repositories_router)
