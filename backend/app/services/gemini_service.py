"""
PaperMind AI - Centralized Gemini Service

Every backend integration with Google Gemini must go through this module.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Any

from google import genai

from app.core.config import settings
from app.services import prompts

logger = logging.getLogger(__name__)


class GeminiServiceError(RuntimeError):
    """Raised when Gemini is unavailable or returns an invalid response."""


class GeminiService:
    """Async-friendly wrapper around the official google-genai SDK."""

    provider_name = "Google Gemini"

    def __init__(
        self,
        *,
        api_key: str | None = None,
        model: str | None = None,
        timeout_seconds: int = 30,
    ) -> None:
        self.api_key = api_key if api_key is not None else settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.timeout_seconds = timeout_seconds
        self._client: genai.Client | None = None

    @property
    def is_configured(self) -> bool:
        """Return whether a non-empty Gemini API key is configured."""
        return bool(self.api_key and self.api_key.strip())

    async def generate_text(self, prompt: str) -> str:
        """
        Generate text with Gemini.

        This method is intentionally generic so future AI features can reuse
        the same provider gateway instead of adding scattered API calls.
        """
        if not prompt.strip():
            raise GeminiServiceError("Prompt is required.")
        if not self.is_configured:
            raise GeminiServiceError("Gemini API key is not configured.")

        try:
            return await asyncio.wait_for(
                self._generate_text_async(prompt),
                timeout=self.timeout_seconds,
            )
        except GeminiServiceError:
            raise
        except Exception as exc:
            raise GeminiServiceError("Gemini text generation failed.") from exc

    async def summarize_document(
        self,
        *,
        text: str,
        topics: list[str] | None = None,
        language: str = "en",
    ) -> str:
        """Generate a document summary with Gemini."""
        prompt = prompts.build_summary_prompt(
            document_text=text,
            topics=topics or [],
            language=language,
        )
        summary = await self.generate_text(prompt)
        if not summary.strip():
            raise GeminiServiceError("Gemini returned an empty summary.")
        logger.info("Summary generated")
        return summary.strip()

    async def extract_topics(self, *, text: str, max_topics: int = 15) -> list[str]:
        """Extract ordered document topics with Gemini."""
        prompt = prompts.build_topics_prompt(document_text=text, max_topics=max_topics)
        response_text = await self.generate_text(prompt)
        topics = _parse_json_string_list(response_text, limit=max_topics)
        if not topics:
            raise GeminiServiceError("Gemini returned no topics.")
        logger.info("Topics extracted")
        return topics

    async def extract_keywords(self, *, text: str, max_keywords: int = 30) -> list[str]:
        """Extract ordered document keywords with Gemini."""
        prompt = prompts.build_keywords_prompt(
            document_text=text,
            max_keywords=max_keywords,
        )
        response_text = await self.generate_text(prompt)
        keywords = _parse_json_string_list(response_text, limit=max_keywords)
        if not keywords:
            raise GeminiServiceError("Gemini returned no keywords.")
        logger.info("Keywords extracted")
        return keywords

    async def health_check(self) -> dict[str, str]:
        """Verify the configured Gemini connection without exposing secrets."""
        if not self.is_configured:
            return {
                "provider": self.provider_name,
                "model": self.model,
                "status": "not_configured",
            }

        try:
            response = await self.generate_text(prompts.HEALTH_CHECK_PROMPT)
            status = "connected" if response.strip() else "unavailable"
        except Exception:
            logger.warning("Gemini health check failed")
            status = "unavailable"

        return {
            "provider": self.provider_name,
            "model": self.model,
            "status": status,
        }

    async def generate_questions(
        self,
        *,
        document: dict,
        config: dict,
        question_specs: list[dict],
        source_chunk: int,
        chunk_text: str,
    ) -> list[dict]:
        """Generate structured questions with Gemini."""
        prompt = prompts.build_question_generation_prompt(
            document=document,
            config=config,
            question_specs=question_specs,
            source_chunk=source_chunk,
            chunk_text=chunk_text,
        )

        last_error: Exception | None = None
        for attempt in range(1, 4):
            try:
                response_text = await self.generate_text(prompt)
                parsed = _parse_json_payload(response_text)
                questions = parsed.get("questions") if isinstance(parsed, dict) else parsed
                if not isinstance(questions, list) or not questions:
                    raise GeminiServiceError("Gemini returned no generated questions.")
                logger.info("Questions generated")
                return [item for item in questions if isinstance(item, dict)]
            except Exception as exc:
                last_error = exc
                logger.warning("Gemini question generation attempt %d failed", attempt)

        raise GeminiServiceError("Gemini question generation failed.") from last_error

    async def generate_flashcards(self, *args: Any, **kwargs: Any) -> Any:
        """Future centralized flashcard-generation entry point."""
        raise NotImplementedError("Flashcard generation is not implemented yet.")

    async def chat(self, *args: Any, **kwargs: Any) -> Any:
        """Future centralized study-assistant chat entry point."""
        raise NotImplementedError("Gemini chat is not implemented yet.")

    def _get_client(self) -> genai.Client:
        if not self.is_configured:
            raise GeminiServiceError("Gemini API key is not configured.")
        if self._client is None:
            self._client = genai.Client(api_key=self.api_key)
            logger.info("Gemini initialized")
        return self._client

    async def _generate_text_async(self, prompt: str) -> str:
        client = self._get_client()
        response = await client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        text = getattr(response, "text", None)
        if not text:
            raise GeminiServiceError("Gemini returned an empty response.")
        return text.strip()


def _parse_json_string_list(response_text: str, *, limit: int) -> list[str]:
    cleaned = response_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\[[\s\S]*\]", cleaned)
        if not match:
            return []
        try:
            parsed = json.loads(match.group(0))
        except json.JSONDecodeError:
            return []

    if not isinstance(parsed, list):
        return []

    values: list[str] = []
    seen: set[str] = set()
    for item in parsed:
        if not isinstance(item, str):
            continue
        value = re.sub(r"\s+", " ", item).strip(" -_.")
        normalized = value.lower()
        if not value or normalized in seen:
            continue
        seen.add(normalized)
        values.append(value)
        if len(values) >= limit:
            break
    return values


def _parse_json_payload(response_text: str) -> dict | list:
    cleaned = response_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
        if not match:
            raise GeminiServiceError("Gemini returned malformed JSON.")
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError as exc:
            raise GeminiServiceError("Gemini returned malformed JSON.") from exc


gemini_service = GeminiService()
