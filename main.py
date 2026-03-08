"""
Explain to a Persona — standalone entry point.
"""
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
app.mount("/", StaticFiles(directory="tools/explain_to_persona/frontend", html=True), name="frontend")
