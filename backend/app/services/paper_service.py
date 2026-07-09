"""
PaperMind AI - Paper Service

Business logic for AI question paper generation, persistence, editing,
single-question regeneration, and deletion.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import logging
import re
from uuid import uuid4

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.paper import create_paper_record, paper_to_response
from app.schemas.paper_schema import GeneratePaperRequest, RegenerateQuestionRequest, UpdatePaperRequest
from app.services.gemini_service import GeminiServiceError, gemini_service

logger = logging.getLogger(__name__)

PAPERS_COLLECTION = "papers"
DOCUMENTS_COLLECTION = "documents"

BLOOM_LEVELS = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
DIFFICULTY_LEVELS = ["easy", "medium", "hard"]
QUESTION_TYPES = ["mcq", "short_answer", "long_answer", "true_false", "fill_blank", "case_study"]

QUESTION_TYPE_LABELS = {
    "mcq": "MCQ",
    "short_answer": "Short Answer",
    "long_answer": "Long Answer",
    "true_false": "True/False",
    "fill_blank": "Fill in the Blanks",
    "case_study": "Case Study",
}


async def ensure_paper_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create indexes used by paper history and ownership checks."""
    collection = db[PAPERS_COLLECTION]
    await collection.create_index([("teacher_id", 1), ("created_at", -1)])
    await collection.create_index([("teacher_id", 1), ("document_id", 1)])
    logger.info("Ensured indexes on papers.teacher_id + papers.created_at")


async def generate_paper(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    payload: GeneratePaperRequest,
) -> dict:
    """Generate, validate, persist, and return a question paper."""
    _assert_teacher_or_admin(current_user)
    document = await _get_owned_processed_document(db, payload.document_id, current_user)

    logger.info(
        "Paper generation started for document %s by user %s",
        payload.document_id,
        current_user["id"],
    )

    question_specs = _build_question_specs(
        total_questions=payload.total_questions,
        total_marks=payload.total_marks,
        bloom_distribution=payload.bloom_distribution,
        difficulty_distribution=payload.difficulty_distribution,
        question_types=payload.question_types,
    )

    generated_questions: list[dict] = []
    generation_provider = gemini_service.model if gemini_service.is_configured else "local-fallback"
    generation_errors: list[str] = []

    for source_chunk, specs in _assign_specs_to_chunks(question_specs, document).items():
        chunk_text = _get_chunk_text(document, source_chunk)
        if not chunk_text:
            continue
        try:
            raw_questions = await gemini_service.generate_questions(
                document=document,
                config=payload.model_dump(),
                question_specs=specs,
                source_chunk=source_chunk,
                chunk_text=chunk_text,
            )
            generated_questions.extend(_normalise_questions(raw_questions, specs, document))
            logger.info("Generated %d questions from chunk %s", len(raw_questions), source_chunk)
        except Exception as exc:
            logger.warning(
                "Question generation fallback for chunk %s: %s",
                source_chunk,
                exc.__class__.__name__,
            )
            generation_errors.append(exc.__class__.__name__)
            generated_questions.extend(_generate_local_questions(specs, document, source_chunk))

    questions = _finalise_questions(
        generated_questions=generated_questions,
        question_specs=question_specs,
        document=document,
    )

    paper_record = create_paper_record(
        teacher_id=current_user["id"],
        document_id=payload.document_id,
        document_title=document.get("title", ""),
        title=payload.title,
        subject=payload.subject,
        exam_name=payload.exam_name,
        total_marks=payload.total_marks,
        total_questions=payload.total_questions,
        bloom_distribution=payload.bloom_distribution,
        difficulty_distribution=payload.difficulty_distribution,
        question_types=payload.question_types,
        instructions=payload.instructions,
        questions=questions,
        generation_provider=generation_provider,
        generation_error=", ".join(sorted(set(generation_errors))) or None,
    )

    result = await db[PAPERS_COLLECTION].insert_one(paper_record)
    paper_record["_id"] = result.inserted_id
    logger.info("Paper generation finished: %s", result.inserted_id)
    return paper_to_response(paper_record)


async def list_papers(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[dict]:
    """Return all generated papers owned by the current teacher."""
    _assert_teacher_or_admin(current_user)
    query: dict = {"teacher_id": current_user["id"]}
    if search:
        escaped = re.escape(search.strip())
        query["$or"] = [
            {"title": {"$regex": escaped, "$options": "i"}},
            {"subject": {"$regex": escaped, "$options": "i"}},
            {"exam_name": {"$regex": escaped, "$options": "i"}},
            {"document_title": {"$regex": escaped, "$options": "i"}},
        ]
    cursor = (
        db[PAPERS_COLLECTION]
        .find(query)
        .sort("created_at", -1)
        .skip(max(0, skip))
        .limit(max(1, min(limit, 200)))
    )
    papers = await cursor.to_list(length=None)
    return [paper_to_response(paper) for paper in papers]


async def get_paper(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    paper_id: str,
) -> dict:
    """Return a single owned generated paper."""
    _assert_teacher_or_admin(current_user)
    paper = await _get_paper_or_404(db, paper_id)
    _assert_paper_owner(paper, current_user)
    return paper_to_response(paper)


async def update_paper(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    paper_id: str,
    payload: UpdatePaperRequest,
) -> dict:
    """Update editable generated paper fields and question metadata."""
    _assert_teacher_or_admin(current_user)
    paper = await _get_paper_or_404(db, paper_id)
    _assert_paper_owner(paper, current_user)

    update_fields: dict = {"updated_at": _utc_now()}
    payload_data = payload.model_dump(exclude_unset=True)
    for field in ("title", "subject", "exam_name", "total_marks", "instructions"):
        if field in payload_data:
            if field == "instructions":
                update_fields.setdefault("configuration", paper.get("configuration", {}))
                update_fields["configuration"] = {
                    **paper.get("configuration", {}),
                    "instructions": payload_data[field],
                }
            update_fields[field] = payload_data[field]

    if payload.questions is not None:
        questions = [question.model_dump() for question in payload.questions]
        if not questions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A paper must contain at least one question.",
            )
        update_fields["questions"] = _renumber_questions(questions)
        update_fields["total_questions"] = len(questions)
        update_fields["total_marks"] = sum(max(1, int(q.get("marks", 1))) for q in questions)

    await db[PAPERS_COLLECTION].update_one({"_id": paper["_id"]}, {"$set": update_fields})
    updated_paper = await db[PAPERS_COLLECTION].find_one({"_id": paper["_id"]})
    return paper_to_response(updated_paper)


async def regenerate_question(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    paper_id: str,
    question_id: str,
    payload: RegenerateQuestionRequest,
) -> dict:
    """Regenerate one question while preserving paper-level configuration."""
    _assert_teacher_or_admin(current_user)
    paper = await _get_paper_or_404(db, paper_id)
    _assert_paper_owner(paper, current_user)
    document = await _get_owned_processed_document(db, paper["document_id"], current_user)

    questions = paper.get("questions", [])
    question_index = next((idx for idx, item in enumerate(questions) if item.get("id") == question_id), -1)
    if question_index < 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    original_question = questions[question_index]
    source_chunk = int(original_question.get("source_chunk") or 1)
    spec = {
        "index": question_index + 1,
        "bloom_level": original_question.get("bloom_level", "remember"),
        "difficulty": original_question.get("difficulty", "medium"),
        "question_type": original_question.get("question_type", "short_answer"),
        "marks": max(1, int(original_question.get("marks", 1))),
        "source_chunk": source_chunk,
        "regeneration_instructions": payload.instructions,
    }

    try:
        generated = await gemini_service.generate_questions(
            document=document,
            config={
                **paper.get("configuration", {}),
                "title": paper.get("title"),
                "subject": paper.get("subject"),
                "exam_name": paper.get("exam_name"),
                "regeneration_instructions": payload.instructions,
            },
            question_specs=[spec],
            source_chunk=source_chunk,
            chunk_text=_get_chunk_text(document, source_chunk),
        )
        replacement = _normalise_questions(generated, [spec], document)[0]
    except Exception as exc:
        logger.warning("Single question regeneration fallback: %s", exc.__class__.__name__)
        replacement = _generate_local_questions([spec], document, source_chunk)[0]

    replacement["id"] = question_id
    questions[question_index] = replacement

    await db[PAPERS_COLLECTION].update_one(
        {"_id": paper["_id"]},
        {"$set": {"questions": questions, "updated_at": _utc_now()}},
    )
    updated_paper = await db[PAPERS_COLLECTION].find_one({"_id": paper["_id"]})
    return paper_to_response(updated_paper)


async def delete_paper(
    *,
    db: AsyncIOMotorDatabase,
    current_user: dict,
    paper_id: str,
) -> dict:
    """Delete an owned generated paper."""
    _assert_teacher_or_admin(current_user)
    paper = await _get_paper_or_404(db, paper_id)
    _assert_paper_owner(paper, current_user)
    await db[PAPERS_COLLECTION].delete_one({"_id": paper["_id"]})
    return {"message": "Paper deleted successfully."}


def _assert_teacher_or_admin(current_user: dict) -> None:
    role = current_user.get("role")
    if role not in {"teacher", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can generate question papers.",
        )


async def _get_owned_processed_document(
    db: AsyncIOMotorDatabase,
    document_id: str,
    current_user: dict,
) -> dict:
    if not ObjectId.is_valid(document_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    document = await db[DOCUMENTS_COLLECTION].find_one({"_id": ObjectId(document_id)})
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    if document.get("user_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden. You do not have access to this document.",
        )
    if document.get("status") not in {"processed", "ready"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document must be processed before paper generation.",
        )
    if not (document.get("clean_text") or document.get("extracted_text")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has no processed text available for generation.",
        )
    return document


async def _get_paper_or_404(db: AsyncIOMotorDatabase, paper_id: str) -> dict:
    if not ObjectId.is_valid(paper_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found.")
    paper = await db[PAPERS_COLLECTION].find_one({"_id": ObjectId(paper_id)})
    if paper is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found.")
    return paper


def _assert_paper_owner(paper: dict, current_user: dict) -> None:
    if paper.get("teacher_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden. You do not have access to this paper.",
        )


def _build_question_specs(
    *,
    total_questions: int,
    total_marks: int,
    bloom_distribution: dict[str, int],
    difficulty_distribution: dict[str, int],
    question_types: list[str],
) -> list[dict]:
    bloom_sequence = _expand_distribution(total_questions, bloom_distribution, BLOOM_LEVELS)
    difficulty_sequence = _expand_distribution(total_questions, difficulty_distribution, DIFFICULTY_LEVELS)
    marks_sequence = _allocate_marks(total_questions, total_marks)
    specs: list[dict] = []
    for index in range(total_questions):
        specs.append(
            {
                "index": index + 1,
                "bloom_level": bloom_sequence[index],
                "difficulty": difficulty_sequence[index],
                "question_type": question_types[index % len(question_types)],
                "marks": marks_sequence[index],
            }
        )
    return specs


def _expand_distribution(total: int, distribution: dict[str, int], keys: list[str]) -> list[str]:
    raw_counts = {
        key: (total * distribution.get(key, 0)) / 100
        for key in keys
    }
    counts = {key: int(value) for key, value in raw_counts.items()}
    remainder = total - sum(counts.values())
    fractions = sorted(
        ((key, raw_counts[key] - counts[key]) for key in keys),
        key=lambda item: item[1],
        reverse=True,
    )
    for index in range(remainder):
        counts[fractions[index % len(fractions)][0]] += 1
    sequence: list[str] = []
    for key in keys:
        sequence.extend([key] * counts[key])
    return sequence[:total]


def _allocate_marks(total_questions: int, total_marks: int) -> list[int]:
    base = total_marks // total_questions
    remainder = total_marks % total_questions
    return [base + (1 if index < remainder else 0) for index in range(total_questions)]


def _assign_specs_to_chunks(question_specs: list[dict], document: dict) -> dict[int, list[dict]]:
    chunks = document.get("chunks") or []
    chunk_indexes = [int(chunk.get("chunk_index", idx + 1)) for idx, chunk in enumerate(chunks)] or [1]
    assigned: dict[int, list[dict]] = defaultdict(list)
    for index, spec in enumerate(question_specs):
        source_chunk = chunk_indexes[index % len(chunk_indexes)]
        assigned[source_chunk].append({**spec, "source_chunk": source_chunk})
    return dict(assigned)


def _get_chunk_text(document: dict, source_chunk: int) -> str:
    for chunk in document.get("chunks") or []:
        if int(chunk.get("chunk_index", 0)) == source_chunk:
            return chunk.get("text", "")
    return (document.get("clean_text") or document.get("extracted_text") or "")[:12000]


def _normalise_questions(raw_questions: list[dict], specs: list[dict], document: dict) -> list[dict]:
    normalised: list[dict] = []
    for index, spec in enumerate(specs):
        raw = raw_questions[index] if index < len(raw_questions) else {}
        question_text = _clean_string(raw.get("question_text") or raw.get("question") or raw.get("text"))
        answer = _clean_string(raw.get("answer") or raw.get("correct_answer"))
        if not question_text or not answer:
            normalised.extend(_generate_local_questions([spec], document, spec.get("source_chunk", 1)))
            continue
        normalised.append(
            {
                "id": raw.get("id") or str(uuid4()),
                "question_text": question_text,
                "answer": answer,
                "bloom_level": _allowed(raw.get("bloom_level"), BLOOM_LEVELS, spec["bloom_level"]),
                "difficulty": _allowed(raw.get("difficulty"), DIFFICULTY_LEVELS, spec["difficulty"]),
                "marks": max(1, int(raw.get("marks") or spec["marks"])),
                "question_type": _allowed(raw.get("question_type"), QUESTION_TYPES, spec["question_type"]),
                "explanation": _clean_string(raw.get("explanation")) or "Generated from the processed document content.",
                "source_chunk": int(raw.get("source_chunk") or spec.get("source_chunk") or 0),
                "confidence_score": _clamp_float(raw.get("confidence_score"), default=0.78),
                "options": _normalise_options(raw.get("options")),
            }
        )
    return normalised


def _finalise_questions(
    *,
    generated_questions: list[dict],
    question_specs: list[dict],
    document: dict,
) -> list[dict]:
    deduped = _dedupe_questions(generated_questions)
    if len(deduped) < len(question_specs):
        missing_specs = question_specs[len(deduped):]
        for spec in missing_specs:
            deduped.extend(_generate_local_questions([spec], document, spec.get("source_chunk", 1)))
    final_questions = deduped[:len(question_specs)]
    for index, spec in enumerate(question_specs):
        final_questions[index] = {
            **final_questions[index],
            "id": final_questions[index].get("id") or str(uuid4()),
            "bloom_level": spec["bloom_level"],
            "difficulty": spec["difficulty"],
            "question_type": spec["question_type"],
            "marks": spec["marks"],
            "source_chunk": final_questions[index].get("source_chunk") or spec.get("source_chunk", 0),
        }
    return _renumber_questions(final_questions)


def _dedupe_questions(questions: list[dict]) -> list[dict]:
    seen: set[str] = set()
    deduped: list[dict] = []
    for question in questions:
        text = _clean_string(question.get("question_text"))
        key = hashlib.sha256(re.sub(r"\W+", "", text.lower()).encode("utf-8")).hexdigest()
        if not text or key in seen:
            continue
        seen.add(key)
        deduped.append(question)
    return deduped


def _generate_local_questions(specs: list[dict], document: dict, source_chunk: int) -> list[dict]:
    topics = document.get("topics") or document.get("keywords") or [document.get("title", "the topic")]
    keywords = document.get("keywords") or topics
    chunk_text = _get_chunk_text(document, source_chunk)
    sentences = _split_sentences(chunk_text) or _split_sentences(document.get("summary", ""))
    questions: list[dict] = []
    for offset, spec in enumerate(specs):
        topic = topics[(spec["index"] + offset - 1) % len(topics)]
        keyword = keywords[(spec["index"] + offset - 1) % len(keywords)]
        sentence = sentences[(spec["index"] + offset - 1) % len(sentences)] if sentences else str(topic)
        questions.append(
            _build_local_question(
                spec=spec,
                topic=str(topic),
                keyword=str(keyword),
                sentence=sentence,
                source_chunk=source_chunk,
            )
        )
    return questions


def _build_local_question(
    *,
    spec: dict,
    topic: str,
    keyword: str,
    sentence: str,
    source_chunk: int,
) -> dict:
    question_type = spec["question_type"]
    bloom_level = spec["bloom_level"]
    difficulty = spec["difficulty"]
    label = QUESTION_TYPE_LABELS.get(question_type, "Question")

    if question_type == "mcq":
        question_text = f"Which statement best explains {topic} in the given study material?"
        options = [
            f"{topic} is related to {keyword}.",
            f"{topic} is unrelated to the document.",
            f"{topic} only applies outside this subject.",
            f"{topic} has no practical use.",
        ]
        answer = options[0]
    elif question_type == "true_false":
        question_text = f"True or False: {sentence}"
        options = ["True", "False"]
        answer = "True"
    elif question_type == "fill_blank":
        question_text = f"Fill in the blank: The concept most closely associated with this statement is ____: {sentence}"
        options = []
        answer = topic
    elif question_type == "case_study":
        question_text = (
            f"Case Study: A teacher is assessing learners on {topic}. "
            f"Using the document context, design an answer that demonstrates {bloom_level} thinking."
        )
        options = []
        answer = f"A strong response should connect {topic} with {keyword} and justify it using the source material."
    else:
        verb = {
            "remember": "Define",
            "understand": "Explain",
            "apply": "Apply",
            "analyze": "Analyze",
            "evaluate": "Evaluate",
            "create": "Create a response about",
        }.get(bloom_level, "Explain")
        question_text = f"{verb} {topic} with reference to the processed document."
        options = []
        answer = f"{topic} should be discussed using the document context, especially its relationship with {keyword}."

    return {
        "id": str(uuid4()),
        "question_text": question_text,
        "answer": answer,
        "bloom_level": bloom_level,
        "difficulty": difficulty,
        "marks": spec["marks"],
        "question_type": question_type,
        "explanation": f"Local fallback {label} generated from processed topics and chunk {source_chunk}.",
        "source_chunk": source_chunk,
        "confidence_score": 0.58,
        "options": options,
    }


def _renumber_questions(questions: list[dict]) -> list[dict]:
    return [{**question, "id": question.get("id") or str(uuid4())} for question in questions]


def _split_sentences(text: str) -> list[str]:
    compact = re.sub(r"\s+", " ", text or "").strip()
    if not compact:
        return []
    return [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", compact) if sentence.strip()]


def _allowed(value: object, allowed: list[str], default: str) -> str:
    normalized = str(value or "").strip().lower().replace(" ", "_").replace("/", "_")
    aliases = {
        "short": "short_answer",
        "long": "long_answer",
        "true_false": "true_false",
        "tf": "true_false",
        "fill": "fill_blank",
        "fill_in_the_blanks": "fill_blank",
    }
    normalized = aliases.get(normalized, normalized)
    return normalized if normalized in allowed else default


def _normalise_options(options: object) -> list[str]:
    if not isinstance(options, list):
        return []
    return [_clean_string(option) for option in options if _clean_string(option)][:6]


def _clean_string(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def _clamp_float(value: object, *, default: float) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return default
    return max(0.0, min(1.0, number))


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)
