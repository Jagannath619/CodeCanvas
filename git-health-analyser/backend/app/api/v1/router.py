from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.repos import router as repos_router
from app.api.v1.health import router as health_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.webhooks import router as webhooks_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(repos_router)
api_router.include_router(health_router)
api_router.include_router(analytics_router)
api_router.include_router(webhooks_router)
