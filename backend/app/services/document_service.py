"""
PaperMind AI - Document Service

Contains all business logic for secure document upload, extraction,
retrieval, and deletion.
"""

import asyncio
import logging
import os
from pathlib import Path
from uuid import uuid4

import fitz
from bson import ObjectId
from docx import Document
from fastapi import HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.models.document import create_document_record, document_to_response

logger = logging.getLogger(__name__)

DOCUMENTS_COLLECTION = "documents"
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024
CHUNK_SIZE_BYTES = 1024 * 1024

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
ALLOWED_MIME_TYPES = {
    "pdf": {"application/pdf"},
    "docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    "txt": {"text/plain"},
}


async def ensure_document_indexes(db: AsyncIOMotorDatabase) -> None:
    """
    Create indexes used by document listing and ownership checks.
    """
    collection = db[DOCUMENTS_COLLECTION]
    await collection.create_index([("user_id", 1), ("created_at", -1)])
    logger.info("Ensured index on documents.user_id + documents.created_at")


async def upload_document(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    file: UploadFile,
    title: str,
    subject: str | None = None,
    description: str | None = None,
) -> dict:
    """
    Validate, store, extract, and persist an uploaded document.
    """
    cleaned_title = title.strip()
    if not cleaned_title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document title is required.",
        )

    original_filename, file_type = _validate_file_metadata(file)
    upload_dir = Path(settings.UPLOAD_DIRECTORY)
    upload_dir.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid4()}.{file_type}"
    file_path = upload_dir / stored_filename
    upload_path = file_path.as_posix()

    file_size = await _save_upload_file(file=file, destination=file_path)
    extracted_text, page_count, word_count, document_status = await _extract_text(
        file_path=file_path,
        file_type=file_type,
    )

    document_record = create_document_record(
        user_id=current_user["id"],
        title=cleaned_title,
        original_filename=original_filename,
        stored_filename=stored_filename,
        file_type=file_type,
        file_size=file_size,
        upload_path=upload_path,
        subject=subject,
        description=description,
        extracted_text=extracted_text,
        page_count=page_count,
        word_count=word_count,
        status=document_status,
    )

    try:
        result = await db[DOCUMENTS_COLLECTION].insert_one(document_record)
    except Exception:
        _delete_file_if_exists(file_path)
        logger.exception("Failed to save document record for user %s", current_user["id"])
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save document record.",
        )

    document_record["_id"] = result.inserted_id
    return document_to_response(document_record)


async def list_documents(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
) -> list[dict]:
    """
    Return all documents owned by the current user, newest first.
    """
    cursor = (
        db[DOCUMENTS_COLLECTION]
        .find({"user_id": current_user["id"]})
        .sort("created_at", -1)
    )
    documents = await cursor.to_list(length=None)
    return [document_to_response(document) for document in documents]


async def get_document(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    document_id: str,
) -> dict:
    """
    Return a single document after enforcing ownership.
    """
    document = await _get_document_or_404(db, document_id)
    _assert_document_owner(document, current_user)
    return document_to_response(document)


async def delete_document(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    document_id: str,
) -> dict:
    """
    Delete a document record and its stored file.
    """
    document = await _get_document_or_404(db, document_id)
    _assert_document_owner(document, current_user)

    await db[DOCUMENTS_COLLECTION].delete_one({"_id": document["_id"]})

    upload_path = document.get("upload_path")
    if upload_path:
        await asyncio.to_thread(_delete_file_if_exists, Path(upload_path))

    return {"message": "Document deleted successfully."}


def _validate_file_metadata(file: UploadFile) -> tuple[str, str]:
    """
    Validate the original filename extension and reported MIME type.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is missing a filename.",
        )

    original_filename = Path(file.filename).name
    extension = Path(original_filename).suffix.lower().lstrip(".")

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Upload PDF, DOCX, or TXT only.",
        )

    content_type = (file.content_type or "").split(";")[0].lower().strip()
    if content_type not in ALLOWED_MIME_TYPES[extension]:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file MIME type.",
        )

    return original_filename, extension


async def _save_upload_file(*, file: UploadFile, destination: Path) -> int:
    """
    Stream the uploaded file to disk while enforcing the 20 MB limit.
    """
    total_size = 0

    try:
        with destination.open("wb") as output:
            while True:
                chunk = await file.read(CHUNK_SIZE_BYTES)
                if not chunk:
                    break

                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE_BYTES:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File too large. Maximum file size is 20 MB.",
                    )

                output.write(chunk)
    except HTTPException:
        _delete_file_if_exists(destination)
        raise
    except Exception as exc:
        _delete_file_if_exists(destination)
        logger.exception("Failed to save uploaded file: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file.",
        ) from exc

    if total_size == 0:
        _delete_file_if_exists(destination)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    return total_size


async def _extract_text(*, file_path: Path, file_type: str) -> tuple[str, int, int, str]:
    """
    Extract raw text and metadata. Extraction failures do not block upload.
    """
    try:
        text, page_count = await asyncio.to_thread(
            _extract_text_sync,
            file_path,
            file_type,
        )
        word_count = len(text.split())
        return text, page_count, word_count, "uploaded"
    except Exception as exc:
        logger.exception("Text extraction failed for %s: %s", file_path, exc)
        return "", 0, 0, "failed"


def _extract_text_sync(file_path: Path, file_type: str) -> tuple[str, int]:
    """
    Synchronous extraction implementation run in a worker thread.
    """
    if file_type == "pdf":
        with fitz.open(file_path) as document:
            text = "".join(page.get_text() for page in document)
            return text, document.page_count

    if file_type == "docx":
        document = Document(file_path)
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)
        return text, 0

    if file_type == "txt":
        with file_path.open("r", encoding="utf-8") as input_file:
            return input_file.read(), 0

    raise ValueError(f"Unsupported file type for extraction: {file_type}")


async def _get_document_or_404(
    db: AsyncIOMotorDatabase,
    document_id: str,
) -> dict:
    """
    Fetch a document by ID or raise 404.
    """
    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )

    document = await db[DOCUMENTS_COLLECTION].find_one({"_id": ObjectId(document_id)})
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )

    return document


def _assert_document_owner(document: dict, current_user: dict) -> None:
    """
    Raise 403 when the requested document belongs to another user.
    """
    if document.get("user_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden. You do not have access to this document.",
        )


def _delete_file_if_exists(file_path: Path) -> None:
    """
    Delete a stored upload if it exists. Missing files are ignored.
    """
    try:
        if file_path.exists():
            os.remove(file_path)
    except Exception as exc:
        logger.warning("Could not delete upload file %s: %s", file_path, exc)
