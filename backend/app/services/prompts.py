"""
PaperMind AI - Prompt Templates

All prompts used by centralized AI services live here so service modules stay
focused on provider communication and response validation.
"""

import json

SUMMARY_PROMPT = """
You are PaperMind AI, an educational document intelligence assistant.
Create a clear 200-400 word summary for the study material below.

Rules:
- Preserve important technical terminology, formulas, definitions, and named concepts.
- Keep the summary useful for teachers preparing question papers.
- Write in the detected document language when possible.
- Return plain text only.

Detected language: {language}
Known topics: {topics}

Document text:
{document_text}
""".strip()

TOPICS_PROMPT = """
You are PaperMind AI, extracting syllabus-style topics from study material.
Return {max_topics} or fewer high-quality topics as a JSON array of strings.

Rules:
- Prefer specific academic concepts over broad generic words.
- Remove duplicates and near-duplicates.
- Do not include explanations, Markdown, numbering, or prose outside the JSON array.

Document text:
{document_text}
""".strip()

KEYWORDS_PROMPT = """
You are PaperMind AI, extracting searchable keywords from study material.
Return {max_keywords} or fewer meaningful keywords as a JSON array of strings.

Rules:
- Prefer important terms, acronyms, formulas, entities, and subject vocabulary.
- Remove stop words, duplicates, and generic filler terms.
- Do not include explanations, Markdown, numbering, or prose outside the JSON array.

Document text:
{document_text}
""".strip()

HEALTH_CHECK_PROMPT = (
    "Reply with exactly this text and nothing else: PaperMind Gemini health check OK"
)

QUESTION_GENERATION_PROMPT = """
You are PaperMind AI, a production question paper generation engine for teachers.
Generate questions only from the processed document context and the provided chunk.

Output contract:
- Return strict JSON only.
- Do not include Markdown fences, comments, explanations outside JSON, or trailing text.
- Return exactly this shape:
{{
  "questions": [
    {{
      "question_text": "string",
      "answer": "string",
      "bloom_level": "remember|understand|apply|analyze|evaluate|create",
      "difficulty": "easy|medium|hard",
      "marks": 1,
      "question_type": "mcq|short_answer|long_answer|true_false|fill_blank|case_study",
      "explanation": "string",
      "source_chunk": 1,
      "confidence_score": 0.0,
      "options": []
    }}
  ]
}}

Rules:
- Generate exactly {question_count} questions matching the target specs.
- Use the marks, Bloom level, difficulty, question type, and source_chunk from each target spec.
- MCQ questions must include 4 plausible options and the answer must match one option.
- True/False questions must have answer "True" or "False".
- Fill in the Blanks questions must contain a blank marker.
- Case Study questions should include a short scenario plus an analytical task.
- Avoid duplicate or near-duplicate questions.
- Use clear exam-ready language.
- Keep confidence_score between 0 and 1.
- Never invent content outside the document context.

Paper configuration JSON:
{configuration_json}

Document metadata JSON:
{document_metadata_json}

Target question specs JSON:
{question_specs_json}

Document chunk {source_chunk}:
{chunk_text}
""".strip()

MAX_PROMPT_TEXT_CHARS = 12000
MAX_QUESTION_CHUNK_CHARS = 10000


def build_summary_prompt(
    *,
    document_text: str,
    topics: list[str],
    language: str,
) -> str:
    """Build the Gemini prompt for document summarization."""
    return SUMMARY_PROMPT.format(
        language=language,
        topics=", ".join(topics[:10]) or "None provided",
        document_text=_clip_document_text(document_text),
    )


def build_topics_prompt(*, document_text: str, max_topics: int) -> str:
    """Build the Gemini prompt for topic extraction."""
    return TOPICS_PROMPT.format(
        max_topics=max_topics,
        document_text=_clip_document_text(document_text),
    )


def build_keywords_prompt(*, document_text: str, max_keywords: int) -> str:
    """Build the Gemini prompt for keyword extraction."""
    return KEYWORDS_PROMPT.format(
        max_keywords=max_keywords,
        document_text=_clip_document_text(document_text),
    )


def build_question_generation_prompt(
    *,
    document: dict,
    config: dict,
    question_specs: list[dict],
    source_chunk: int,
    chunk_text: str,
) -> str:
    """Build the strict JSON prompt for question generation."""
    document_metadata = {
        "title": document.get("title"),
        "subject": document.get("subject"),
        "language": document.get("language", "en"),
        "topics": document.get("topics", [])[:15],
        "keywords": document.get("keywords", [])[:30],
        "summary": document.get("summary", "")[:1500],
    }
    return QUESTION_GENERATION_PROMPT.format(
        question_count=len(question_specs),
        configuration_json=json.dumps(config, ensure_ascii=False),
        document_metadata_json=json.dumps(document_metadata, ensure_ascii=False),
        question_specs_json=json.dumps(question_specs, ensure_ascii=False),
        source_chunk=source_chunk,
        chunk_text=chunk_text[:MAX_QUESTION_CHUNK_CHARS].strip(),
    )


def _clip_document_text(document_text: str) -> str:
    return document_text[:MAX_PROMPT_TEXT_CHARS].strip()
