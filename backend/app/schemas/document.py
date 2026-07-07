"""
PaperMind AI - Document Schemas

Pydantic v2 response models for document upload and management endpoints.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class DocumentResponse(BaseModel):
    """Document metadata and extracted content returned by the API."""

    id: str = Field(..., description="MongoDB document ID.")
    user_id: str = Field(..., description="Owner user ID.")
    title: str = Field(..., description="User-provided document title.")
    original_filename: str = Field(..., description="Original client filename.")
    stored_filename: str = Field(..., description="UUID-generated filename stored on disk.")
    file_type: str = Field(..., description="Document type: pdf, docx, or txt.")
    file_size: int = Field(..., description="File size in bytes.")
    upload_path: str = Field(..., description="Relative upload path.")
    subject: str | None = Field(default=None, description="Optional subject.")
    description: str | None = Field(default=None, description="Optional description.")
    extracted_text: str = Field(..., description="Raw text extracted at upload time.")
    page_count: int = Field(..., description="PDF page count, or 0 when not applicable.")
    word_count: int = Field(..., description="Number of words in extracted text.")
    status: str = Field(..., description="Document processing status.")
    created_at: datetime = Field(..., description="Creation timestamp.")
    updated_at: datetime = Field(..., description="Last update timestamp.")


class DeleteDocumentResponse(BaseModel):
    """Response returned after deleting a document."""

    message: str = Field(..., description="Deletion result message.")
