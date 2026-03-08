# Explain to a Persona

Standalone MVP: explain any concept in the voice of a chosen persona. Part of a suite of AI micro-tools.

## Features

- **Concept + persona**: Enter a concept (e.g. blockchain, compound interest) and pick a persona. Get 2–3 short explanations in that persona’s voice plus **one thing this person would care about most**.
- **Optional sources**: Paste notes or upload PDF/DOCX to ground the explanation in your material.
- **API**: JSON `POST /api/explain-to-persona/explain` or multipart `POST /api/explain-to-persona/explain-from-files` for file/paste.
- **Plain frontend**: Dark theme, HTML/CSS/JS only — no React, no npm, no build step.

## Personas (fixed list)

- 10-year-old  
- Your grandma  
- Skeptical investor  
- Hiring manager  
- Curious teenager  

## Local setup

1. **Python 3.10+** and a virtualenv:

   ```bash
   cd C:\explain_to_persona
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment**: Copy `.env.example` to `.env` and set at least:

   - `PLATFORM_GROQ_API_KEY` (required for Groq)

   Optional: `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_GROQ_API_KEY_3` for key rotation; `PLATFORM_OPENAI_API_KEY` for OpenAI fallback.

3. **Run**:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   Open http://localhost:8000

## Deploy on Railway

- Connect this repo to Railway.
- Set **root directory** to this project (e.g. `C:\explain_to_persona` or the repo root if the repo is only this app).
- Add **Config vars** (env):
  - `PLATFORM_GROQ_API_KEY` = your Groq API key  
  - Optionally `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_OPENAI_API_KEY`, etc.
- Railway will use the **Procfile**: `web: python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- Deploy; the app will serve the frontend at `/` and the API under `/api`.

## Env vars (all under `PLATFORM_` prefix)

| Variable | Required | Description |
|----------|----------|-------------|
| `PLATFORM_GROQ_API_KEY` | Yes | Groq API key (primary). |
| `PLATFORM_GROQ_API_KEY_2` | No | Second Groq key for rotation. |
| `PLATFORM_GROQ_API_KEY_3` | No | Third Groq key for rotation. |
| `PLATFORM_OPENAI_API_KEY` | No | OpenAI key used as fallback if no Groq keys. |

Never hardcode keys; use `.env` or your host’s env config.

## Future

We will later upgrade to a better tech stack, significantly improve the frontend, and add a solid backend (auth, payments, etc.). This repo is **MVP only**.
