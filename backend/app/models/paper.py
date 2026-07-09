"""
PaperMind AI - Paper Model Helpers

Defines helper functions for creating and serialising generated question
papers stored in MongoDB's ``papers`` collection.
"""

from datetime import datetime, timezone


def create_paper_record(
    *,
    teacher_id: str,
    document_id: str,
    document_title: str,
    title: str,
    subject: str,
    exam_name: str | None,
    total_marks: int,
    total_questions: int,
    bloom_distribution: dict[str, int],
    difficulty_distribution: dict[str, int],
    question_types: list[str],
    instructions: str | None,
    questions: list[dict],
    generation_provider: str,
    generation_error: str | None = None,
) -> dict:
    """Build a generated paper record ready for insertion."""
    now = datetime.now(timezone.utc)
    configuration = {
        "total_marks": total_marks,
        "total_questions": total_questions,
        "bloom_distribution": bloom_distribution,
        "difficulty_distribution": difficulty_distribution,
        "question_types": question_types,
        "instructions": instructions.strip() if instructions else None,
    }

    return {
        "teacher_id": teacher_id,
        "document_id": document_id,
        "document_title": document_title,
        "title": title.strip(),
        "subject": subject.strip(),
        "exam_name": exam_name.strip() if exam_name else None,
        "total_marks": total_marks,
        "total_questions": total_questions,
        "configuration": configuration,
        "questions": questions,
        "status": "generated",
        "generation_provider": generation_provider,
        "generation_error": generation_error,
        "generated_at": now,
        "created_at": now,
        "updated_at": now,
    }


def paper_to_response(paper: dict) -> dict:
    """Convert a MongoDB paper document into an API-safe response."""
    return {
        "id": str(paper["_id"]),
        "teacher_id": paper["teacher_id"],
        "document_id": paper["document_id"],
        "document_title": paper.get("document_title", ""),
        "title": paper["title"],
        "subject": paper["subject"],
        "exam_name": paper.get("exam_name"),
        "total_marks": paper.get("total_marks", 0),
        "total_questions": paper.get("total_questions", len(paper.get("questions", []))),
        "configuration": paper.get("configuration", {}),
        "questions": paper.get("questions", []),
        "status": paper.get("status", "generated"),
        "generation_provider": paper.get("generation_provider", "unknown"),
        "generation_error": paper.get("generation_error"),
        "generated_at": paper.get("generated_at", paper.get("created_at")),
        "created_at": paper["created_at"],
        "updated_at": paper["updated_at"],
    }
