# BizPilot AI

**An AI-powered business operations assistant for small businesses.** Built by NexoraForge AI for the AMD AI League.

## What it does

- Business dashboard with delivered revenue, total orders, and orders needing attention.
- Order management: add orders and update their status.
- AI business assistant powered by Groq-hosted models.
- Product-level analysis separates delivered revenue from pending/processing pipeline value.
- All amounts are currently displayed and interpreted in US dollars (USD).
- Aggregated business data is sent to the AI; customer names are not included in the AI prompt.
- Markdown answers are rendered as readable headings, lists, and tables in the chat.
- Demo data is inserted automatically on first launch.
- Health endpoint: `/health`.

## Tech stack

- Python, Flask, Gunicorn
- SQLite
- Groq API (configure `GROQ_MODEL` to a model available to your Groq account; current suggested value: `openai/gpt-oss-120b`)
- HTML, CSS, JavaScript

## Run locally

1. Install Python 3.10+.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Set `GROQ_API_KEY` and `GROQ_MODEL` to enable AI chat.
5. Run: `python app.py`.
6. Open `http://localhost:5000`.

On Windows PowerShell:
```powershell
$env:GROQ_API_KEY="your_groq_api_key"
$env:GROQ_MODEL="openai/gpt-oss-120b"
```

## Deploy on Render

1. Connect this repository as a Render Web Service.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `gunicorn app:app`.
4. Add `GROQ_API_KEY` as a secret environment variable.
5. Set `GROQ_MODEL` to a model currently available to your Groq account (for example, `openai/gpt-oss-120b`).

## Important prototype notes

- The initial orders are sample/demo records, not real customer data.
- Delivered revenue counts only orders with status `Delivered`.
- Pending and Processing amounts are shown separately as pipeline value; they are not revenue.
- Profit, margin, return on ad spend, and stock recommendations require cost, advertising, and inventory data that this MVP does not yet collect.
- The prototype currently uses US dollars (USD) as its default reporting currency. This is a reporting setting, not a currency conversion.
- SQLite is suitable for this demonstration. On hosts with ephemeral filesystems, data can reset when the service restarts or redeploys. Use a managed persistent database before production use.
- The assistant provides analysis and recommendations only. It does not autonomously execute payments, contact customers, or modify orders through chat.
- Do not commit API keys or real customer personal data to GitHub.

## Project status

MVP prototype with a live demo. Validate the deployment and demo data before presenting.
