"""
PaperMind AI - Paper Routes

Authenticated endpoints for AI question paper generation and management.
"""

from io import BytesIO
import re

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.auth import get_current_user
from app.database.mongodb import get_database
from app.schemas.paper_schema import (
    DeletePaperResponse,
    GeneratePaperRequest,
    PaperAnswersResponse,
    PaperListResponse,
    PaperResponse,
    RegenerateQuestionRequest,
    UpdatePaperRequest,
)
from app.services.paper_service import (
    delete_paper,
    generate_paper,
    get_paper,
    list_papers,
    regenerate_question,
    update_paper,
)
from app.services.pdf_service import (
    build_answer_payload,
    generate_answer_key_pdf,
    generate_question_paper_pdf,
)

router = APIRouter(tags=["Papers"])


@router.post(
    "/generate",
    response_model=PaperResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a question paper",
)
async def generate_paper_route(
    payload: GeneratePaperRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Generate and persist a question paper from a processed document."""
    return await generate_paper(db=db, current_user=current_user, payload=payload)


@router.get(
    "",
    response_model=list[PaperListResponse],
    summary="List generated papers",
)
async def list_papers_route(
    search: str | None = Query(default=None, max_length=120),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> list[dict]:
    """Return generated papers owned by the current teacher."""
    return await list_papers(
        db=db,
        current_user=current_user,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{paper_id}/pdf",
    summary="Download a generated question paper PDF",
)
async def download_paper_pdf_route(
    paper_id: str,
    department: str | None = Query(default=None, max_length=120),
    course_code: str | None = Query(default=None, max_length=80),
    semester: str | None = Query(default=None, max_length=80),
    exam_type: str | None = Query(default=None, max_length=120),
    duration: str | None = Query(default=None, max_length=80),
    exam_date: str | None = Query(default=None, max_length=80),
    instructions: str | None = Query(default=None, max_length=2000),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> StreamingResponse:
    """Stream a professional question paper PDF for an owned paper."""
    paper = await get_paper(db=db, current_user=current_user, paper_id=paper_id)
    pdf_bytes = generate_question_paper_pdf(
        paper=paper,
        metadata_overrides=_metadata_overrides(
            department=department,
            course_code=course_code,
            semester=semester,
            exam_type=exam_type,
            duration=duration,
            exam_date=exam_date,
            instructions=instructions,
        ),
    )
    return _pdf_response(pdf_bytes, filename=f"{paper['title']}_question_paper.pdf")


@router.get(
    "/{paper_id}/answers",
    response_model=PaperAnswersResponse,
    summary="Get a generated paper answer key",
)
async def get_paper_answers_route(
    paper_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return teacher-only answers for an owned generated paper."""
    paper = await get_paper(db=db, current_user=current_user, paper_id=paper_id)
    return build_answer_payload(paper)


@router.get(
    "/{paper_id}/answers/pdf",
    summary="Download a generated answer key PDF",
)
async def download_answer_key_pdf_route(
    paper_id: str,
    department: str | None = Query(default=None, max_length=120),
    course_code: str | None = Query(default=None, max_length=80),
    semester: str | None = Query(default=None, max_length=80),
    exam_type: str | None = Query(default=None, max_length=120),
    duration: str | None = Query(default=None, max_length=80),
    exam_date: str | None = Query(default=None, max_length=80),
    instructions: str | None = Query(default=None, max_length=2000),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> StreamingResponse:
    """Stream a faculty-only answer key PDF for an owned paper."""
    paper = await get_paper(db=db, current_user=current_user, paper_id=paper_id)
    pdf_bytes = generate_answer_key_pdf(
        paper=paper,
        metadata_overrides=_metadata_overrides(
            department=department,
            course_code=course_code,
            semester=semester,
            exam_type=exam_type,
            duration=duration,
            exam_date=exam_date,
            instructions=instructions,
        ),
    )
    return _pdf_response(pdf_bytes, filename=f"{paper['title']}_answer_key.pdf")


@router.get(
    "/{paper_id}",
    response_model=PaperResponse,
    summary="Get a generated paper",
)
async def get_paper_route(
    paper_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Return one owned generated paper."""
    return await get_paper(db=db, current_user=current_user, paper_id=paper_id)


@router.put(
    "/{paper_id}",
    response_model=PaperResponse,
    summary="Update a generated paper",
)
async def update_paper_route(
    paper_id: str,
    payload: UpdatePaperRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Update editable paper fields and question list."""
    return await update_paper(
        db=db,
        current_user=current_user,
        paper_id=paper_id,
        payload=payload,
    )


@router.post(
    "/{paper_id}/questions/{question_id}/regenerate",
    response_model=PaperResponse,
    summary="Regenerate one question",
)
async def regenerate_question_route(
    paper_id: str,
    question_id: str,
    payload: RegenerateQuestionRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Regenerate one question without regenerating the whole paper."""
    return await regenerate_question(
        db=db,
        current_user=current_user,
        paper_id=paper_id,
        question_id=question_id,
        payload=payload,
    )


@router.delete(
    "/{paper_id}",
    response_model=DeletePaperResponse,
    summary="Delete a generated paper",
)
async def delete_paper_route(
    paper_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """Delete an owned generated paper."""
    return await delete_paper(db=db, current_user=current_user, paper_id=paper_id)


def _metadata_overrides(**values: str | None) -> dict[str, str | None]:
    return {key: value.strip() if isinstance(value, str) and value.strip() else None for key, value in values.items()}


def _pdf_response(pdf_bytes: bytes, *, filename: str) -> StreamingResponse:
    safe_filename = _safe_filename(filename)
    headers = {"Content-Disposition": f'attachment; filename="{safe_filename}"'}
    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf", headers=headers)


def _safe_filename(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]+", "_", value).strip("_") or "paper.pdf"
