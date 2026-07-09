"""
PaperMind AI - Development AI Routes

Diagnostic endpoints for centralized AI integrations.
"""

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter(tags=["AI"])


@router.get(
    "/health",
    summary="Gemini health check",
)
async def ai_health_check_route() -> dict[str, str]:
    """
    Development-only Gemini connectivity check.

    Hidden in non-development environments to avoid exposing operational AI
    status publicly.
    """
    if settings.ENVIRONMENT.lower() not in {"development", "dev", "local", "test"}:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not found.",
        )

    return await gemini_service.health_check()
