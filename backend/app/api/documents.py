"""
PaperMind AI - Document Routes

Provides authenticated endpoints for document upload and management.
"""

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.auth import get_current_user
from app.database.mongodb import get_database
from app.schemas.document import (
    DeleteDocumentResponse,
    DocumentResponse,
    DocumentStatisticsResponse,
    DocumentSummaryResponse,
    DocumentTopicsResponse,
)
from app.services.document_service import (
    delete_document,
    get_document,
    get_document_statistics,
    get_document_summary,
    get_document_topics,
    list_documents,
    upload_document,
)

router = APIRouter(tags=["Documents"])


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document",
)
async def upload_document_route(
    file: UploadFile = File(...),
    title: str = Form(...),
    subject: str | None = Form(default=None),
    description: str | None = Form(default=None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Upload and extract a document for the authenticated user."""
    return await upload_document(
        db=db,
        current_user=current_user,
        file=file,
        title=title,
        subject=subject,
        description=description,
    )


@router.get(
    "",
    response_model=list[DocumentResponse],
    summary="List current user's documents",
)
async def list_documents_route(
    search: str | None = Query(default=None, max_length=120),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[dict]:
    """Return documents owned by the authenticated user."""
    return await list_documents(
        db=db,
        current_user=current_user,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{document_id}/summary",
    response_model=DocumentSummaryResponse,
    summary="Get a document summary",
)
async def get_document_summary_route(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return the generated summary for a single owned document."""
    return await get_document_summary(
        db=db,
        current_user=current_user,
        document_id=document_id,
    )


@router.get(
    "/{document_id}/topics",
    response_model=DocumentTopicsResponse,
    summary="Get document topics and keywords",
)
async def get_document_topics_route(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return topics and keywords for a single owned document."""
    return await get_document_topics(
        db=db,
        current_user=current_user,
        document_id=document_id,
    )


@router.get(
    "/{document_id}/statistics",
    response_model=DocumentStatisticsResponse,
    summary="Get document statistics",
)
async def get_document_statistics_route(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return calculated statistics for a single owned document."""
    return await get_document_statistics(
        db=db,
        current_user=current_user,
        document_id=document_id,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Get a document",
)
async def get_document_route(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return a single owned document."""
    return await get_document(
        db=db,
        current_user=current_user,
        document_id=document_id,
    )


@router.delete(
    "/{document_id}",
    response_model=DeleteDocumentResponse,
    summary="Delete a document",
)
async def delete_document_route(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Delete an owned document and its stored file."""
    return await delete_document(
        db=db,
        current_user=current_user,
        document_id=document_id,
    )
