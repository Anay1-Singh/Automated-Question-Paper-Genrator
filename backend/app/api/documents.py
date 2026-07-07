"""
PaperMind AI - Document Routes

Provides authenticated endpoints for document upload and management.
"""

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.auth import get_current_user
from app.database.mongodb import get_database
from app.schemas.document import DeleteDocumentResponse, DocumentResponse
from app.services.document_service import (
    delete_document,
    get_document,
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
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[dict]:
    """Return documents owned by the authenticated user."""
    return await list_documents(db=db, current_user=current_user)


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
