# Deploy: GitHub → Railway

## 1. GitHub

### Create the repo
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `explain-to-persona` (or any name)
3. **Do not** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### Push from local
```powershell
cd C:\explain_to_persona
git remote add origin https://github.com/YOUR_USERNAME/explain-to-persona.git
git branch -M main
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username.

---

## 2. Railway

### New project
1. Go to [railway.app](https://railway.app) and sign in (GitHub)
2. **New Project** → **Deploy from GitHub repo**
3. Select `explain-to-persona` (or your repo name)
4. Railway will detect the Procfile and deploy

### Environment variables
In your project → **Variables** tab, add:

| Variable | Value |
|----------|-------|
| `PLATFORM_GROQ_API_KEY` | Your Groq API key |

Optional: `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_OPENAI_API_KEY`

### Custom domain (optional)
Project → **Settings** → **Domains** → add a custom domain or use the generated `*.railway.app` URL.

---

## Done
Your app will be live at the Railway URL. The Procfile runs:
```
web: python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```
