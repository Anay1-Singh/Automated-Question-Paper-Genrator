"""
PaperMind AI - Document Processing Service

Transforms extracted document text into an AI-ready knowledge source.
This module avoids any dependency on the original uploaded file after
text extraction has completed.
"""

from __future__ import annotations

from collections import Counter
import logging
import math
import re

from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

MIN_CHUNK_WORDS = 800
MAX_CHUNK_WORDS = 1200
SUMMARY_MIN_WORDS = 200
SUMMARY_MAX_WORDS = 400

ENGLISH_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an",
    "and", "any", "are", "as", "at", "be", "because", "been", "before",
    "being", "below", "between", "both", "but", "by", "can", "could",
    "did", "do", "does", "doing", "down", "during", "each", "few", "for",
    "from", "further", "had", "has", "have", "having", "he", "her", "here",
    "hers", "herself", "him", "himself", "his", "how", "i", "if", "in",
    "into", "is", "it", "its", "itself", "just", "me", "more", "most",
    "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once",
    "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own",
    "same", "she", "should", "so", "some", "such", "than", "that", "the",
    "their", "theirs", "them", "themselves", "then", "there", "these",
    "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while",
    "who", "whom", "why", "will", "with", "you", "your", "yours",
    "yourself", "yourselves", "chapter", "section", "unit", "page",
}

HINDI_STOPWORDS = {
    "और", "का", "की", "के", "को", "में", "से", "है", "हैं", "था", "थे",
    "एक", "यह", "वह", "लिए", "पर", "इस", "उस", "हो", "भी", "कर", "तो",
    "ने", "या", "तक", "जो", "कि", "साथ", "द्वारा", "इन", "उन",
}


def clean_text(text: str) -> str:
    """
    Normalize raw extracted text while preserving educational structure.
    """
    if not text:
        return ""

    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    normalized = re.sub(r"([A-Za-z])-\n([A-Za-z])", r"\1\2", normalized)
    normalized = re.sub(r"[ \t]+", " ", normalized)

    lines = [line.strip() for line in normalized.split("\n")]
    lines = _remove_page_numbers(lines)
    lines = _remove_repeated_headers_and_footers(lines)
    paragraphs = _merge_broken_line_wraps(lines)
    cleaned = "\n\n".join(paragraph for paragraph in paragraphs if paragraph.strip())
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def detect_language(text: str) -> str:
    """
    Detect English or Hindi using script and stopword signals.
    """
    if not text:
        return "en"

    devanagari_chars = len(re.findall(r"[\u0900-\u097F]", text))
    visible_chars = max(len(re.findall(r"\S", text)), 1)
    if devanagari_chars >= 5 and devanagari_chars / visible_chars > 0.05:
        return "hi"

    hindi_words = sum(1 for word in _tokenize_words(text) if word in HINDI_STOPWORDS)
    english_words = sum(1 for word in _tokenize_words(text.lower()) if word in ENGLISH_STOPWORDS)
    return "hi" if hindi_words > english_words else "en"


def chunk_document(
    text: str,
    min_words: int = MIN_CHUNK_WORDS,
    max_words: int = MAX_CHUNK_WORDS,
) -> list[dict]:
    """
    Split text into ordered, sentence-aware chunks for downstream AI tasks.
    """
    if not text.strip():
        return []

    chunks: list[str] = []
    current_parts: list[str] = []
    current_words = 0

    for paragraph in _split_paragraphs(text):
        paragraph_words = _word_count(paragraph)
        if paragraph_words == 0:
            continue

        if paragraph_words > max_words:
            for sentence_group in _split_long_paragraph(paragraph, max_words):
                current_parts, current_words = _add_text_to_chunks(
                    sentence_group,
                    current_parts,
                    current_words,
                    chunks,
                    min_words,
                    max_words,
                )
            continue

        current_parts, current_words = _add_text_to_chunks(
            paragraph,
            current_parts,
            current_words,
            chunks,
            min_words,
            max_words,
        )

    if current_parts:
        chunks.append("\n\n".join(current_parts).strip())

    return [
        {
            "chunk_index": index + 1,
            "text": chunk,
            "word_count": _word_count(chunk),
            "character_count": len(chunk),
        }
        for index, chunk in enumerate(chunks)
        if chunk.strip()
    ]


def extract_topics(text: str, max_topics: int = 15) -> list[str]:
    """
    Extract high-quality document topics using KeyBERT, spaCy, or local n-grams.
    """
    keybert_topics = _extract_keybert_phrases(text, top_n=max_topics, ngram_range=(1, 3))
    if keybert_topics:
        return keybert_topics[:max_topics]

    spacy_topics = _extract_spacy_noun_phrases(text, top_n=max_topics)
    if spacy_topics:
        return spacy_topics[:max_topics]

    return _extract_ngram_topics(text, max_topics=max_topics)


def extract_keywords(text: str, max_keywords: int = 30) -> list[str]:
    """
    Extract meaningful keywords with duplicates removed.
    """
    keybert_keywords = _extract_keybert_phrases(text, top_n=max_keywords, ngram_range=(1, 1))
    if keybert_keywords:
        return keybert_keywords[:max_keywords]

    words = [
        word
        for word in _tokenize_words(text)
        if _is_meaningful_word(word)
    ]
    ranked = Counter(words).most_common(max_keywords * 2)
    return _dedupe_preserve_order([_display_phrase(word) for word, _ in ranked])[:max_keywords]


def generate_summary(
    text: str,
    topics: list[str] | None = None,
    language: str = "en",
) -> str:
    """
    Generate a 200-400 word local extractive summary.
    """
    if not text.strip():
        return ""

    return _generate_extractive_summary(
        text=text,
        topics=topics or [],
        min_words=SUMMARY_MIN_WORDS,
        max_words=SUMMARY_MAX_WORDS,
    )


def calculate_statistics(
    text: str,
    page_count: int = 0,
    chunks: list[dict] | None = None,
) -> dict:
    """
    Calculate document statistics used by dashboards and future AI modules.
    """
    word_count = _word_count(text)
    return {
        "page_count": page_count,
        "word_count": word_count,
        "character_count": len(text),
        "reading_time_minutes": estimate_reading_time(word_count),
        "paragraph_count": len(_split_paragraphs(text)),
        "sentence_count": len(_split_sentences(text)),
        "chunk_count": len(chunks or []),
    }


def estimate_reading_time(word_count: int, words_per_minute: int = 200) -> int:
    """
    Estimate reading time in minutes.
    """
    if word_count <= 0:
        return 0
    return max(1, math.ceil(word_count / words_per_minute))


async def process_document(
    *,
    extracted_text: str,
    page_count: int = 0,
) -> dict:
    """
    Run the full document intelligence pipeline on extracted text.
    """
    logger.info("Cleaning document text...")
    cleaned_text = clean_text(extracted_text)
    logger.info("Cleaning Complete")

    language = detect_language(cleaned_text)
    logger.info("Language Detection Complete: %s", language)

    chunks = chunk_document(cleaned_text)
    logger.info("Chunking Complete: %d chunks", len(chunks))

    topics = await _extract_topics_with_gemini_fallback(cleaned_text)
    logger.info("Topic Extraction Complete: %d topics", len(topics))

    keywords = await _extract_keywords_with_gemini_fallback(cleaned_text)
    logger.info("Keyword Extraction Complete: %d keywords", len(keywords))

    summary = await _generate_summary_with_gemini_fallback(
        cleaned_text,
        topics=topics,
        language=language,
    )
    logger.info("Summary Complete")

    statistics = calculate_statistics(cleaned_text, page_count=page_count, chunks=chunks)
    logger.info("Processing Finished")

    return {
        "clean_text": cleaned_text,
        "language": language,
        "chunks": chunks,
        "topics": topics,
        "keywords": keywords,
        "summary": summary,
        **statistics,
    }


async def _extract_topics_with_gemini_fallback(text: str) -> list[str]:
    if not text.strip():
        return []
    try:
        return await gemini_service.extract_topics(text=text, max_topics=15)
    except Exception as exc:
        logger.warning(
            "Fallback to local processing: topic extraction unavailable (%s)",
            exc.__class__.__name__,
        )
        return extract_topics(text)


async def _extract_keywords_with_gemini_fallback(text: str) -> list[str]:
    if not text.strip():
        return []
    try:
        return await gemini_service.extract_keywords(text=text, max_keywords=30)
    except Exception as exc:
        logger.warning(
            "Fallback to local processing: keyword extraction unavailable (%s)",
            exc.__class__.__name__,
        )
        return extract_keywords(text)


async def _generate_summary_with_gemini_fallback(
    text: str,
    *,
    topics: list[str],
    language: str,
) -> str:
    if not text.strip():
        return ""
    try:
        summary = await gemini_service.summarize_document(
            text=text,
            topics=topics,
            language=language,
        )
        return _limit_words(summary, SUMMARY_MAX_WORDS)
    except Exception as exc:
        logger.warning(
            "Fallback to local processing: summary generation unavailable (%s)",
            exc.__class__.__name__,
        )
        return generate_summary(text, topics=topics, language=language)


def _remove_page_numbers(lines: list[str]) -> list[str]:
    page_number_pattern = re.compile(
        r"^(?:page\s*)?(?:\d+|[ivxlcdm]+)(?:\s*(?:of|/)\s*\d+)?$",
        re.IGNORECASE,
    )
    return [line for line in lines if not page_number_pattern.match(line.strip())]


def _remove_repeated_headers_and_footers(lines: list[str]) -> list[str]:
    normalized_lines = [_normalize_line_for_repeat_detection(line) for line in lines]
    counts = Counter(line for line in normalized_lines if _is_repeat_candidate(line))
    repeated = {line for line, count in counts.items() if count >= 3}
    return [
        original
        for original, normalized in zip(lines, normalized_lines, strict=False)
        if normalized not in repeated
    ]


def _normalize_line_for_repeat_detection(line: str) -> str:
    return re.sub(r"\s+", " ", line).strip().lower()


def _is_repeat_candidate(line: str) -> bool:
    if not line or len(line) > 120 or len(line) < 3:
        return False
    if re.match(r"^(\d+[\).]|[-*\u2022])\s+", line):
        return False
    if any(symbol in line for symbol in ("=", "+", "-", "->", "<=", ">=")):
        return False
    return True


def _merge_broken_line_wraps(lines: list[str]) -> list[str]:
    paragraphs: list[str] = []
    buffer: list[str] = []

    def flush_buffer() -> None:
        if not buffer:
            return
        if any(_looks_like_structured_line(line) for line in buffer):
            paragraph = "\n".join(buffer)
        else:
            paragraph = " ".join(buffer)
        paragraphs.append(re.sub(r"[ \t]+", " ", paragraph).strip())
        buffer.clear()

    for line in lines:
        if not line.strip():
            flush_buffer()
            continue
        buffer.append(line.strip())

    flush_buffer()
    return paragraphs


def _looks_like_structured_line(line: str) -> bool:
    stripped = line.strip()
    return bool(
        re.match(r"^(\d+[\).]|[A-Za-z][\).]|[-*\u2022])\s+", stripped)
        or re.search(r"[:=+\-*/<>]{2,}|=", stripped)
    )


def _split_paragraphs(text: str) -> list[str]:
    return [paragraph.strip() for paragraph in re.split(r"\n\s*\n", text) if paragraph.strip()]


def _split_sentences(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    sentences = re.split(r"(?<=[.!?\u0964])\s+", text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def _split_long_paragraph(paragraph: str, max_words: int) -> list[str]:
    groups: list[str] = []
    current: list[str] = []
    current_words = 0

    for sentence in _split_sentences(paragraph):
        sentence_words = _word_count(sentence)
        if current and current_words + sentence_words > max_words:
            groups.append(" ".join(current).strip())
            current = []
            current_words = 0
        current.append(sentence)
        current_words += sentence_words

    if current:
        groups.append(" ".join(current).strip())
    return groups


def _add_text_to_chunks(
    text: str,
    current_parts: list[str],
    current_words: int,
    chunks: list[str],
    min_words: int,
    max_words: int,
) -> tuple[list[str], int]:
    text_words = _word_count(text)
    if current_parts and current_words >= min_words and current_words + text_words > max_words:
        chunks.append("\n\n".join(current_parts).strip())
        return [text], text_words

    current_parts.append(text)
    return current_parts, current_words + text_words


def _word_count(text: str) -> int:
    return len(_tokenize_words(text))


def _tokenize_words(text: str) -> list[str]:
    return re.findall(r"[A-Za-z][A-Za-z0-9+#.\-']{1,}|[\u0900-\u097F]{2,}", text)


def _is_meaningful_word(word: str) -> bool:
    normalized = word.lower().strip("-_.#'")
    if len(normalized) < 3:
        return False
    if normalized in ENGLISH_STOPWORDS or normalized in HINDI_STOPWORDS:
        return False
    if normalized.isdigit():
        return False
    return True


def _extract_keybert_phrases(
    text: str,
    top_n: int,
    ngram_range: tuple[int, int],
) -> list[str]:
    try:
        from keybert import KeyBERT  # type: ignore

        model = KeyBERT()
        results = model.extract_keywords(
            text[:50000],
            keyphrase_ngram_range=ngram_range,
            stop_words="english",
            top_n=top_n,
        )
        return _dedupe_preserve_order([_display_phrase(phrase) for phrase, _ in results])
    except Exception as exc:
        logger.debug("KeyBERT extraction unavailable: %s", exc)
        return []


def _extract_spacy_noun_phrases(text: str, top_n: int) -> list[str]:
    try:
        import spacy  # type: ignore

        try:
            nlp = spacy.load("en_core_web_sm")
        except Exception:
            nlp = spacy.blank("en")

        if "parser" not in nlp.pipe_names:
            return []

        doc = nlp(text[:100000])
        phrases = [
            chunk.text.strip()
            for chunk in doc.noun_chunks
            if 3 <= len(chunk.text.strip()) <= 80
        ]
        ranked = Counter(_normalize_phrase(phrase) for phrase in phrases).most_common(top_n * 2)
        return _dedupe_preserve_order([_display_phrase(phrase) for phrase, _ in ranked])[:top_n]
    except Exception as exc:
        logger.debug("spaCy extraction unavailable: %s", exc)
        return []


def _extract_ngram_topics(text: str, max_topics: int) -> list[str]:
    candidate_scores: Counter[str] = Counter()
    sentences = _split_sentences(text)

    for sentence in sentences:
        tokens = [
            token
            for token in _tokenize_words(sentence)
            if _is_meaningful_word(token)
        ]
        for ngram_size in (3, 2):
            for index in range(0, max(0, len(tokens) - ngram_size + 1)):
                phrase_tokens = tokens[index:index + ngram_size]
                phrase = " ".join(phrase_tokens)
                if _phrase_has_signal(phrase_tokens):
                    candidate_scores[_normalize_phrase(phrase)] += ngram_size

    for token in _tokenize_words(text):
        if _is_meaningful_word(token) and (token.isupper() or len(token) > 8):
            candidate_scores[_normalize_phrase(token)] += 1

    ranked = [phrase for phrase, _ in candidate_scores.most_common(max_topics * 3)]
    return _dedupe_preserve_order([_display_phrase(phrase) for phrase in ranked])[:max_topics]


def _phrase_has_signal(tokens: list[str]) -> bool:
    return any(token.isupper() or len(token) > 4 for token in tokens)


def _normalize_phrase(phrase: str) -> str:
    return re.sub(r"\s+", " ", phrase).strip().lower()


def _display_phrase(phrase: str) -> str:
    phrase = re.sub(r"\s+", " ", phrase).strip(" -_.")
    if not phrase:
        return phrase
    words = phrase.split()
    if all(re.search(r"[\u0900-\u097F]", word) for word in words):
        return phrase
    display_words = []
    for word in words:
        if word.isupper() or any(char.isdigit() for char in word):
            display_words.append(word.upper() if len(word) <= 5 else word)
        else:
            display_words.append(word.capitalize())
    return " ".join(display_words)


def _dedupe_preserve_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    deduped: list[str] = []
    for item in items:
        normalized = _normalize_phrase(item)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        deduped.append(item)
    return deduped


def _generate_extractive_summary(
    text: str,
    topics: list[str],
    min_words: int,
    max_words: int,
) -> str:
    sentences = _split_sentences(text)
    if not sentences:
        return _limit_words(text, max_words)

    keywords = set(_normalize_phrase(keyword) for keyword in extract_keywords(text, max_keywords=25))
    topic_terms = set(_normalize_phrase(topic) for topic in topics)

    scored: list[tuple[int, float, str]] = []
    for index, sentence in enumerate(sentences):
        normalized = _normalize_phrase(sentence)
        words = [word.lower() for word in _tokenize_words(sentence)]
        keyword_hits = sum(1 for word in words if word in keywords)
        topic_hits = sum(1 for topic in topic_terms if topic and topic in normalized)
        position_bonus = 1.0 if index < max(3, len(sentences) * 0.15) else 0.0
        score = keyword_hits + (topic_hits * 2) + position_bonus
        scored.append((index, score, sentence))

    selected: list[tuple[int, str]] = []
    total_words = 0
    for index, _, sentence in sorted(scored, key=lambda item: item[1], reverse=True):
        sentence_words = _word_count(sentence)
        if total_words + sentence_words > max_words and total_words >= min_words:
            continue
        selected.append((index, sentence))
        total_words += sentence_words
        if total_words >= min_words:
            break

    if not selected:
        return _limit_words(text, max_words)

    summary = " ".join(sentence for _, sentence in sorted(selected, key=lambda item: item[0]))
    return _limit_words(summary, max_words)


def _limit_words(text: str, max_words: int) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text.strip()
    return " ".join(words[:max_words]).strip()
