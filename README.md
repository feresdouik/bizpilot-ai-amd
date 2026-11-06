# BizPilot AI

**An AI-powered business operations assistant for small businesses.** Built by NexoraForge AI for the AMD AI League.

## What it does

- Business dashboard with delivered revenue, total orders, and orders needing attention.
- Order management: add orders and update their status.
- AI business assistant powered by Groq-hosted Llama models.
- Demo data is inserted automatically on first launch.
- Health endpoint: `/health`.

## Tech stack

- Python, Flask, Gunicorn
- SQLite
- Groq API (default model: `llama-3.3-70b-versatile`)
- HTML, CSS, JavaScript

## Run locally

1. Install Python 3.10+.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Optional: set `GROQ_API_KEY` to enable AI chat.
5. Run: `python app.py`.
6. Open `http://localhost:5000`.

On Windows PowerShell, set the key for the current terminal with:
`$env:GROQ_API_KEY="your_groq_api_key"`

## Deploy on Render

1. Create a new **Web Service** in Render and connect this repository.
2. Render can detect the included `render.yaml`; alternatively use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app`
3. Add `GROQ_API_KEY` as a secret environment variable.
4. Keep `GROQ_MODEL` as `llama-3.3-70b-versatile` unless you choose another model available to your Groq account.

## Important prototype notes

- The initial orders are sample/demo records, not real customer data.
- SQLite is suitable for this demonstration. On hosts with ephemeral filesystems, data can reset when the service restarts or redeploys. Use a managed persistent database before production use.
- The assistant currently provides analysis and recommendations only. It does not autonomously execute payments, contact customers, or modify orders through chat.
- Do not commit API keys or customer personal data to GitHub.

## Project status

MVP implementation. Validate the app, configure the Groq secret, and publish a working live demo before submitting to the hackathon.
