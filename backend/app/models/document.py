"""
PaperMind AI - Document Model Helpers

Defines helper functions for building and serialising documents stored in
MongoDB's ``documents`` collection.
"""

from datetime import datetime, timezone


def create_document_record(
    *,
    user_id: str,
    title: str,
    original_filename: str,
    stored_filename: str,
    file_type: str,
    file_size: int,
    upload_path: str,
    subject: str | None,
    description: str | None,
    extracted_text: str,
    page_count: int,
    word_count: int,
    status: str,
) -> dict:
    """
    Build a document record ready for insertion into MongoDB.
    """
    now = datetime.now(timezone.utc)

    return {
        "user_id": user_id,
        "title": title.strip(),
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "file_type": file_type,
        "file_size": file_size,
        "upload_path": upload_path,
        "subject": subject.strip() if subject else None,
        "description": description.strip() if description else None,
        "extracted_text": extracted_text,
        "page_count": page_count,
        "word_count": word_count,
        "status": status,
        "created_at": now,
        "updated_at": now,
    }


def document_to_response(document: dict) -> dict:
    """
    Convert a raw MongoDB document record into an API-safe response.
    """
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "title": document["title"],
        "original_filename": document["original_filename"],
        "stored_filename": document["stored_filename"],
        "file_type": document["file_type"],
        "file_size": document["file_size"],
        "upload_path": document["upload_path"],
        "subject": document.get("subject"),
        "description": document.get("description"),
        "extracted_text": document.get("extracted_text", ""),
        "page_count": document.get("page_count", 0),
        "word_count": document.get("word_count", 0),
        "status": document.get("status", "uploaded"),
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }
