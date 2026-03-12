# Explain to a Persona

Standalone MVP: explain any concept in the voice of a chosen persona. Part of a suite of AI micro-tools.

## Features

- **Concept + persona**: Enter a concept (e.g. blockchain, compound interest) and pick a persona. Get 2–3 short explanations in that persona’s voice plus **one thing this person would care about most**.
- **Optional sources**: Paste notes or upload PDF/DOCX to ground the explanation in your material.
- **API**: JSON `POST /api/explain-to-persona/explain` or multipart `POST /api/explain-to-persona/explain-from-files` for file/paste.
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion. Red/crimson theme.

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

2. **Environment**: Copy `.env.example` to `.env` and set `PLATFORM_GROQ_API_KEY`.

3. **Local dev** (two terminals):

   **Terminal 1 — FastAPI backend:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   **Terminal 2 — Next.js frontend:**
   ```bash
   cd frontend
   copy .env.example .env.local
   npm install
   npm run dev
   ```
   Open http://localhost:3000 (frontend proxies API to backend via `NEXT_PUBLIC_API_URL`).

4. **After frontend changes** (before deploy):
   ```bash
   cd frontend
   npm run build
   cd ..
   git add -A
   git commit -m "update frontend"
   git push
   ```
   The built `frontend/out/` is committed so Railway serves it (no Node.js on Railway).

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
