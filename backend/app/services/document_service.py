"""
PaperMind AI - Document Service

Contains all business logic for secure document upload, extraction,
retrieval, and deletion.
"""

import asyncio
from datetime import datetime, timezone
import logging
import os
from pathlib import Path
import re
from uuid import uuid4

import fitz
from bson import ObjectId
from docx import Document
from fastapi import HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.models.document import create_document_record, document_to_response
from app.services.document_processing_service import process_document

logger = logging.getLogger(__name__)

DOCUMENTS_COLLECTION = "documents"
PAPERS_COLLECTION = "papers"
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
    logger.info("Upload Started")
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
        extracted_text="",
        page_count=0,
        word_count=0,
        status="uploading",
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

    try:
        await _update_document_fields(
            db,
            result.inserted_id,
            {"status": "extracting", "updated_at": _utc_now()},
        )

        extracted_text, page_count, word_count = await _extract_text(
            file_path=file_path,
            file_type=file_type,
        )
        logger.info("Extraction Complete")

        await _update_document_fields(
            db,
            result.inserted_id,
            {
                "extracted_text": extracted_text,
                "page_count": page_count,
                "word_count": word_count,
                "status": "processing",
                "processing_error": None,
                "updated_at": _utc_now(),
            },
        )

        processed_data = await process_document(
            extracted_text=extracted_text,
            page_count=page_count,
        )

        await _update_document_fields(
            db,
            result.inserted_id,
            {
                **processed_data,
                "status": "processed",
                "processing_error": None,
                "updated_at": _utc_now(),
            },
        )

        processed_document = await db[DOCUMENTS_COLLECTION].find_one({"_id": result.inserted_id})
        return document_to_response(processed_document)
    except Exception as exc:
        logger.exception("Document processing failed for %s: %s", result.inserted_id, exc)
        await _update_document_fields(
            db,
            result.inserted_id,
            {
                "status": "failed",
                "processing_error": str(exc) or "Document processing failed.",
                "updated_at": _utc_now(),
            },
        )
        failed_document = await db[DOCUMENTS_COLLECTION].find_one({"_id": result.inserted_id})
        return document_to_response(failed_document)


async def list_documents(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[dict]:
    """
    Return all documents owned by the current user, newest first.
    """
    query: dict = {"user_id": current_user["id"]}
    if search:
        escaped = re.escape(search.strip())
        query["$or"] = [
            {"title": {"$regex": escaped, "$options": "i"}},
            {"subject": {"$regex": escaped, "$options": "i"}},
            {"original_filename": {"$regex": escaped, "$options": "i"}},
        ]

    cursor = (
        db[DOCUMENTS_COLLECTION]
        .find(query)
        .sort("created_at", -1)
        .skip(max(0, skip))
        .limit(max(1, min(limit, 200)))
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


async def get_document_summary(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    document_id: str,
) -> dict:
    """
    Return only summary data for an owned document.
    """
    document = await get_document(db=db, current_user=current_user, document_id=document_id)
    return {
        "id": document["id"],
        "title": document["title"],
        "status": document["status"],
        "summary": document["summary"],
    }


async def get_document_topics(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    document_id: str,
) -> dict:
    """
    Return topics and keywords for an owned document.
    """
    document = await get_document(db=db, current_user=current_user, document_id=document_id)
    return {
        "id": document["id"],
        "title": document["title"],
        "status": document["status"],
        "topics": document["topics"],
        "keywords": document["keywords"],
    }


async def get_document_statistics(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    document_id: str,
) -> dict:
    """
    Return processing and reading statistics for an owned document.
    """
    document = await get_document(db=db, current_user=current_user, document_id=document_id)
    return {
        "id": document["id"],
        "title": document["title"],
        "status": document["status"],
        "file_type": document["file_type"],
        "file_size": document["file_size"],
        "page_count": document["page_count"],
        "word_count": document["word_count"],
        "character_count": document["character_count"],
        "reading_time_minutes": document["reading_time_minutes"],
        "language": document["language"],
        "paragraph_count": document["paragraph_count"],
        "sentence_count": document["sentence_count"],
        "chunk_count": document["chunk_count"],
    }


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

    await db[PAPERS_COLLECTION].delete_many(
        {
            "teacher_id": current_user["id"],
            "document_id": document_id,
        }
    )
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


async def _extract_text(*, file_path: Path, file_type: str) -> tuple[str, int, int]:
    """
    Extract raw text and metadata.
    """
    try:
        text, page_count = await asyncio.to_thread(
            _extract_text_sync,
            file_path,
            file_type,
        )
        word_count = len(text.split())
        return text, page_count, word_count
    except Exception as exc:
        logger.exception("Text extraction failed for %s: %s", file_path, exc)
        raise RuntimeError("Text extraction failed.") from exc


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


async def _update_document_fields(
    db: AsyncIOMotorDatabase,
    document_id: ObjectId,
    fields: dict,
) -> None:
    """
    Update a document record by ObjectId.
    """
    await db[DOCUMENTS_COLLECTION].update_one(
        {"_id": document_id},
        {"$set": fields},
    )


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)
