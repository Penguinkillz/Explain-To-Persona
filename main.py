"""
Explain to a Persona — standalone entry point.
"""
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from tools.explain_to_persona.router import router as explain_router

app = FastAPI(title="Explain to a Persona", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(explain_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}


# Frontend: use path relative to this file (project root)
_frontend_dir = Path(__file__).parent / "frontend" / "out"
if _frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="frontend")
else:
    @app.get("/")
    def _root():
        return {"error": "Frontend not built", "api": "/api/explain-to-persona/explain"}
