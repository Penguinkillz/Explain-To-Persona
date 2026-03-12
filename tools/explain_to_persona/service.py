"""Core explain-to-persona logic — no FastAPI dependencies here."""
import json
import re

from fastapi import HTTPException

from core.llm import get_llm_client
from tools.explain_to_persona.models import ExplainToPersonaRequest, ExplainToPersonaResponse


def _build_prompt(payload: ExplainToPersonaRequest) -> str:
    concept_block = payload.concept.strip()
    if payload.sources_text and payload.sources_text.strip():
        concept_block += f"\n\n---\nSource material / notes:\n{payload.sources_text.strip()}"

    return f"""Explain the following concept as if you are talking to: "{payload.persona}".

Concept to explain:
{concept_block}

Instructions:
- Write in that persona's voice: use the vocabulary, tone, and concerns that this person would have.
- Give exactly 2 to 3 short explanations (each 1–3 sentences). Vary the angle slightly (e.g. one simple, one with an analogy, one with a practical takeaway).
- Then identify the ONE thing this person would care about most — a single sentence.

Return ONLY valid JSON in exactly this structure (no markdown, no code fences, no control characters):
{{
  "explanations": [
    "First short explanation in the persona's voice.",
    "Second short explanation.",
    "Third short explanation (optional)."
  ],
  "key_insight": "The one thing this person would care about most."
}}

Rules:
- explanations must be an array of 2 or 3 strings.
- key_insight must be a single string.
- All string values must be valid JSON — escape any special characters.
- Do NOT include newlines or tab characters inside string values; use a space instead.""".strip()


def _sanitize(content: str) -> str:
    content = content.lstrip("\ufeff")
    content = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", content)
    return content


def _fix_json_escapes(s: str) -> str:
    """Replace invalid JSON escape sequences with literal chars. Keep valid: \", \\, \/, \b, \f, \n, \r, \t, \uXXXX."""
    result = []
    i = 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            next_c = s[i + 1]
            if next_c in '"\\/bfnrt':
                result.append("\\")
                result.append(next_c)
                i += 2
            elif next_c == "u" and i + 5 <= len(s):
                hex_part = s[i + 2 : i + 6]
                if all(h in "0123456789abcdefABCDEF" for h in hex_part):
                    result.append("\\")
                    result.append("u")
                    result.append(hex_part)
                    i += 6
                else:
                    result.append(next_c)
                    i += 2
            else:
                result.append(next_c)
                i += 2
        else:
            result.append(s[i])
            i += 1
    return "".join(result)


def _parse_response(content: str) -> dict:
    content = _sanitize(content)
    content = _fix_json_escapes(content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start, end = content.find("{"), content.rfind("}")
        if start != -1 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                pass
        raise


def explain_to_persona(payload: ExplainToPersonaRequest) -> ExplainToPersonaResponse:
    client, model = get_llm_client()
    prompt = _build_prompt(payload)

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You explain concepts in a specific persona's voice. Return clean JSON only — no markdown, no code fences.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM API error: {exc}") from exc

    raw = completion.choices[0].message.content or ""

    try:
        data = _parse_response(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to parse model output: {exc}"
        ) from exc

    explanations = data.get("explanations")
    key_insight = data.get("key_insight")

    if not isinstance(explanations, list) or len(explanations) < 2:
        raise HTTPException(
            status_code=502,
            detail="Model response must include 'explanations' as a list of at least 2 strings.",
        )
    explanations = [str(x).strip() for x in explanations[:3]]
    if not key_insight or not isinstance(key_insight, str):
        raise HTTPException(
            status_code=502,
            detail="Model response must include 'key_insight' as a string.",
        )
    key_insight = str(key_insight).strip()

    return ExplainToPersonaResponse(
        concept=payload.concept,
        persona=payload.persona,
        explanations=explanations,
        key_insight=key_insight,
    )
