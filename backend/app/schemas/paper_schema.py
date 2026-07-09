"""
PaperMind AI - Paper Schemas

Pydantic v2 models for AI question paper generation and management.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

BloomLevel = Literal["remember", "understand", "apply", "analyze", "evaluate", "create"]
DifficultyLevel = Literal["easy", "medium", "hard"]
QuestionType = Literal[
    "mcq",
    "short_answer",
    "long_answer",
    "true_false",
    "fill_blank",
    "case_study",
]

BLOOM_LEVELS = {"remember", "understand", "apply", "analyze", "evaluate", "create"}
DIFFICULTY_LEVELS = {"easy", "medium", "hard"}
QUESTION_TYPES = {
    "mcq",
    "short_answer",
    "long_answer",
    "true_false",
    "fill_blank",
    "case_study",
}


class QuestionMetadata(BaseModel):
    """Generated question with answer and AI provenance metadata."""

    id: str = Field(..., description="Stable question ID.")
    question_text: str = Field(..., min_length=3)
    answer: str = Field(..., min_length=1)
    bloom_level: BloomLevel
    difficulty: DifficultyLevel
    marks: int = Field(..., ge=1)
    question_type: QuestionType
    explanation: str = Field(default="")
    source_chunk: int = Field(default=0, ge=0)
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)
    options: list[str] = Field(default_factory=list)


class PaperConfiguration(BaseModel):
    """Generation configuration persisted with each paper."""

    total_marks: int = Field(..., ge=1, le=500)
    total_questions: int = Field(..., ge=1, le=100)
    bloom_distribution: dict[str, int]
    difficulty_distribution: dict[str, int]
    question_types: list[QuestionType] = Field(..., min_length=1)
    instructions: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def validate_configuration(self) -> "PaperConfiguration":
        _validate_distribution(self.bloom_distribution, BLOOM_LEVELS, "Bloom distribution")
        _validate_distribution(
            self.difficulty_distribution,
            DIFFICULTY_LEVELS,
            "Difficulty distribution",
        )
        if self.total_marks < self.total_questions:
            raise ValueError("Total marks must be greater than or equal to total questions.")
        return self


class GeneratePaperRequest(BaseModel):
    """Request body for ``POST /api/papers/generate``."""

    document_id: str = Field(..., min_length=1)
    title: str = Field(..., min_length=3, max_length=160)
    subject: str = Field(..., min_length=2, max_length=120)
    exam_name: str | None = Field(default=None, max_length=120)
    total_marks: int = Field(..., ge=1, le=500)
    total_questions: int = Field(..., ge=1, le=100)
    bloom_distribution: dict[str, int]
    difficulty_distribution: dict[str, int]
    question_types: list[QuestionType] = Field(..., min_length=1)
    instructions: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def validate_request(self) -> "GeneratePaperRequest":
        PaperConfiguration(
            total_marks=self.total_marks,
            total_questions=self.total_questions,
            bloom_distribution=self.bloom_distribution,
            difficulty_distribution=self.difficulty_distribution,
            question_types=self.question_types,
            instructions=self.instructions,
        )
        return self


class UpdatePaperRequest(BaseModel):
    """Request body for updating a generated paper."""

    title: str | None = Field(default=None, min_length=3, max_length=160)
    subject: str | None = Field(default=None, min_length=2, max_length=120)
    exam_name: str | None = Field(default=None, max_length=120)
    total_marks: int | None = Field(default=None, ge=1, le=500)
    instructions: str | None = Field(default=None, max_length=2000)
    questions: list[QuestionMetadata] | None = None


class RegenerateQuestionRequest(BaseModel):
    """Optional instructions for single-question regeneration."""

    instructions: str | None = Field(default=None, max_length=1000)


class PaperResponse(BaseModel):
    """Generated paper response."""

    id: str
    teacher_id: str
    document_id: str
    document_title: str
    title: str
    subject: str
    exam_name: str | None = None
    total_marks: int
    total_questions: int
    configuration: dict
    questions: list[QuestionMetadata]
    status: str
    generation_provider: str
    generation_error: str | None = None
    generated_at: datetime
    created_at: datetime
    updated_at: datetime


class PaperListResponse(BaseModel):
    """Compact generated paper item for history screens."""

    id: str
    teacher_id: str
    document_id: str
    document_title: str
    title: str
    subject: str
    exam_name: str | None = None
    total_marks: int
    total_questions: int
    status: str
    generation_provider: str
    generated_at: datetime
    created_at: datetime
    updated_at: datetime
    questions: list[QuestionMetadata]


class PaperAnswerItem(BaseModel):
    """Single faculty answer entry returned by the answer key endpoint."""

    question_id: str
    number: int
    question_text: str
    answer: str
    explanation: str
    bloom_level: str
    difficulty: str
    marks: int
    question_type: str
    source_chunk: int
    confidence_score: float
    options: list[str] = Field(default_factory=list)


class PaperAnswersResponse(BaseModel):
    """Teacher-only answer key response."""

    paper_id: str
    title: str
    subject: str
    exam_name: str | None = None
    total_marks: int
    total_questions: int
    answers: list[PaperAnswerItem]


class DeletePaperResponse(BaseModel):
    """Response returned after deleting a generated paper."""

    message: str


def _validate_distribution(
    distribution: dict[str, int],
    allowed_keys: set[str],
    label: str,
) -> None:
    unknown = set(distribution) - allowed_keys
    if unknown:
        raise ValueError(f"{label} contains unsupported keys: {', '.join(sorted(unknown))}.")
    missing = allowed_keys - set(distribution)
    if missing:
        raise ValueError(f"{label} is missing keys: {', '.join(sorted(missing))}.")
    if any(value < 0 or value > 100 for value in distribution.values()):
        raise ValueError(f"{label} values must be between 0 and 100.")
    if sum(distribution.values()) != 100:
        raise ValueError(f"{label} must add up to 100%.")
