"""FastAPI router for Explain to Persona endpoints."""
from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from core.file_extract import extract_text_from_file
from tools.explain_to_persona.models import ExplainToPersonaRequest, ExplainToPersonaResponse, PERSONA_OPTIONS
from tools.explain_to_persona.service import explain_to_persona

router = APIRouter(prefix="/explain-to-persona", tags=["Explain to Persona"])


@router.post("/explain", response_model=ExplainToPersonaResponse)
async def explain_concept(payload: ExplainToPersonaRequest) -> ExplainToPersonaResponse:
    if not payload.concept.strip():
        raise HTTPException(status_code=400, detail="Concept cannot be empty.")
    if not payload.persona.strip():
        raise HTTPException(status_code=400, detail="Persona is required.")
    return explain_to_persona(payload)


@router.post("/explain-from-files", response_model=ExplainToPersonaResponse)
async def explain_from_files(
    concept: str = Form(""),
    persona: str = Form(""),
    sources_text: str = Form(""),
    files: Optional[List[UploadFile]] = File(default=None),
) -> ExplainToPersonaResponse:
    if not persona.strip():
        raise HTTPException(status_code=400, detail="Persona is required.")

    extracted_parts: list[str] = []

    if sources_text.strip():
        extracted_parts.append(sources_text.strip())

    for f in files or []:
        if not f.filename:
            continue
        text = await extract_text_from_file(f)
        if text.strip():
            extracted_parts.append(f"[From {f.filename}]\n{text.strip()}")

    concept_clean = concept.strip()
    if not concept_clean and not extracted_parts:
        raise HTTPException(
            status_code=400,
            detail="Provide a concept and/or paste text or upload a PDF or DOCX file.",
        )

    combined = "\n\n".join(extracted_parts) if extracted_parts else ""
    concept_for_request = concept_clean if concept_clean else (combined[:300] + "…" if len(combined) > 300 else combined)
    sources_for_request = combined if concept_clean and combined else (combined if combined else None)

    return explain_to_persona(
        ExplainToPersonaRequest(
            concept=concept_for_request,
            persona=persona.strip(),
            sources_text=sources_for_request or None,
        )
    )


@router.get("/personas")
async def list_personas() -> list[str]:
    return PERSONA_OPTIONS
