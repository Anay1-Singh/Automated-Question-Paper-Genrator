"""
PaperMind AI - Document Schemas

Pydantic v2 response models for document upload and management endpoints.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    """Ordered semantic text chunk stored for AI workflows."""

    chunk_index: int = Field(..., description="1-based chunk order.")
    text: str = Field(..., description="Chunk text.")
    word_count: int = Field(..., description="Words in this chunk.")
    character_count: int = Field(..., description="Characters in this chunk.")


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
    clean_text: str = Field(..., description="Cleaned and normalized text.")
    summary: str = Field(..., description="Generated summary.")
    topics: list[str] = Field(default_factory=list, description="Extracted topics.")
    keywords: list[str] = Field(default_factory=list, description="Extracted keywords.")
    chunks: list[DocumentChunk] = Field(default_factory=list, description="Semantic chunks.")
    page_count: int = Field(..., description="PDF page count, or 0 when not applicable.")
    word_count: int = Field(..., description="Number of words in extracted text.")
    character_count: int = Field(..., description="Number of characters in cleaned text.")
    reading_time_minutes: int = Field(..., description="Estimated reading time.")
    language: str = Field(..., description="Detected language code.")
    paragraph_count: int = Field(..., description="Paragraph count.")
    sentence_count: int = Field(..., description="Sentence count.")
    chunk_count: int = Field(..., description="Semantic chunk count.")
    status: str = Field(..., description="Document processing status.")
    processing_error: str | None = Field(default=None, description="Processing failure details.")
    created_at: datetime = Field(..., description="Creation timestamp.")
    updated_at: datetime = Field(..., description="Last update timestamp.")


class DocumentSummaryResponse(BaseModel):
    """Summary endpoint response."""

    id: str
    title: str
    status: str
    summary: str


class DocumentTopicsResponse(BaseModel):
    """Topics endpoint response."""

    id: str
    title: str
    status: str
    topics: list[str]
    keywords: list[str]


class DocumentStatisticsResponse(BaseModel):
    """Statistics endpoint response."""

    id: str
    title: str
    status: str
    file_type: str
    file_size: int
    page_count: int
    word_count: int
    character_count: int
    reading_time_minutes: int
    language: str
    paragraph_count: int
    sentence_count: int
    chunk_count: int


class DeleteDocumentResponse(BaseModel):
    """Response returned after deleting a document."""

    message: str = Field(..., description="Deletion result message.")
