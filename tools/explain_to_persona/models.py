from typing import Optional

from pydantic import BaseModel


PERSONA_OPTIONS = [
    "10-year-old",
    "Your grandma",
    "Skeptical investor",
    "Hiring manager",
    "Curious teenager",
]


class ExplainToPersonaRequest(BaseModel):
    concept: str
    persona: str
    sources_text: Optional[str] = None


class ExplainToPersonaResponse(BaseModel):
    concept: str
    persona: str
    explanations: list[str]
    key_insight: str
