"""
PaperMind AI - FastAPI Application Entry Point

Initialises the FastAPI application, configures middleware,
registers lifespan events for MongoDB, and mounts all route handlers.
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.core.config import settings
from app.database.mongodb import close_mongo, connect_to_mongo, get_database
from app.services.auth_service import ensure_indexes
from app.services.document_service import ensure_document_indexes

# =====================================================
# Logging
# =====================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# =====================================================
# Lifespan — replaces deprecated startup/shutdown events
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manages application startup and shutdown lifecycle.

    On startup  → connects to MongoDB Atlas.
    On shutdown → closes the MongoDB connection.
    """
    # ---------- Startup ----------
    logger.info("Starting PaperMind AI Backend...")
    os.makedirs("uploads", exist_ok=True)
    await connect_to_mongo()

    # Create required database indexes (idempotent).
    await ensure_indexes(get_database())
    await ensure_document_indexes(get_database())

    logger.info("PaperMind AI Backend is ready.")

    yield  # Application runs here

    # ---------- Shutdown ----------
    logger.info("Shutting down PaperMind AI Backend...")
    await close_mongo()
    logger.info("PaperMind AI Backend shutdown complete.")


# =====================================================
# FastAPI Application
# =====================================================

app = FastAPI(
    title="PaperMind AI Backend",
    description="AI Powered Question Paper Generator using Bloom's Taxonomy.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# =====================================================
# Middleware — CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# Routers
# =====================================================

app.include_router(auth_router)
app.include_router(documents_router, prefix="/api/documents")


# =====================================================
# Health & Status Routes
# =====================================================

@app.get(
    "/",
    tags=["Status"],
    summary="Root",
    description="Returns a simple status message confirming the API is running.",
)
async def root() -> dict:
    """Root endpoint — confirms the backend is running."""
    return {"message": "PaperMind AI Backend Running"}


@app.get(
    "/health",
    tags=["Status"],
    summary="Health Check",
    description="Lightweight health check for load balancers and monitoring.",
)
async def health_check() -> dict:
    """Returns a basic health status."""
    return {"status": "healthy"}


@app.get(
    "/db-test",
    tags=["Status"],
    summary="Database Connectivity Test",
    description="Pings MongoDB Atlas and reports connection status.",
    responses={
        200: {
            "description": "Database is connected.",
            "content": {
                "application/json": {
                    "example": {
                        "database": "connected",
                        "database_name": "papermind",
                        "status": "healthy",
                    }
                }
            },
        },
        503: {
            "description": "Database is unreachable.",
            "content": {
                "application/json": {
                    "example": {
                        "database": "disconnected",
                        "error": "Connection timed out",
                    }
                }
            },
        },
    },
)
async def db_test() -> JSONResponse:
    """
    Pings MongoDB Atlas to verify connectivity.

    Returns 200 with connection details on success,
    or 503 with error details on failure.
    """
    try:
        db = get_database()
        await db.command("ping")
        return JSONResponse(
            status_code=200,
            content={
                "database": "connected",
                "database_name": settings.DATABASE_NAME,
                "status": "healthy",
            },
        )
    except Exception as exc:
        logger.error("Database connectivity test failed: %s", exc)
        return JSONResponse(
            status_code=503,
            content={
                "database": "disconnected",
                "error": str(exc),
            },
        )
