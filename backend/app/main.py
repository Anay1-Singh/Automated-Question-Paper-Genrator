from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.database.session import get_db

settings = get_settings()

# ── Application Instance ─────────────────────────────────────
app = FastAPI(
    title="PaperMind AI API",
    version="1.0.0",
    description="AI-powered Question Paper Generation Platform using Bloom's Taxonomy.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── CORS Configuration ───────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,       # React dev server
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)


# ── Health Routes ─────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root() -> dict:
    """Welcome endpoint confirming the API is running."""
    return {"message": "PaperMind AI Backend Running"}


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Lightweight health probe for monitoring and load balancers."""
    return {"status": "healthy"}


# ── Database Test Route ───────────────────────────────────────

@app.get("/db-test", tags=["Health"])
def db_test(db: Session = Depends(get_db)) -> dict:
    """Verify that the PostgreSQL connection is alive."""
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {exc}",
        )


# ── Router Registration ───────────────────────────────────────
from app.api.endpoints import auth

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

