# BizPilot AI

**An AI business operations assistant for small businesses.**

Built by **NexoraForge AI** for the **AMD AI League**.

BizPilot AI combines a lightweight order-management dashboard with an AI assistant that turns order records into clear business metrics and practical recommendations.

<p align="center">
  <a href="https://bizpilot-ai-amd.onrender.com"><strong>Open Live Demo ↗</strong></a>
  &nbsp;·&nbsp;
  <a href="https://bizpilot-ai-amd.onrender.com/health">Health Check</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/feresdouik/bizpilot-ai-amd">Source Code</a>
</p>

> **Demo note:** The starter orders are fictional sample records. Amounts are shown in USD. The AI assistant provides analysis only; it does not execute business actions.

## The problem

Small businesses often manage orders manually and struggle to turn scattered records into useful information. It can be difficult to distinguish completed revenue from orders still in progress or identify which products contribute most to delivered sales.

## The solution

BizPilot AI brings order tracking, performance indicators, and AI-assisted analysis into one simple workspace. It calculates a business snapshot from order statuses and gives the AI assistant aggregated figures to explain — without sending customer names in the analysis prompt.

## Features

- **Business dashboard:** delivered revenue, total orders, orders needing attention, delivered order count, pipeline value, cancelled orders, and average delivered order value.
- **Order management:** add orders and update their statuses from the dashboard.
- **AI business assistant:** ask questions about performance and receive structured summaries and practical recommendations.
- **Product performance:** compare products by delivered revenue, with pending/processing pipeline value reported separately.
- **Privacy-aware AI context:** the assistant receives aggregated business metrics; customer names are excluded from its analysis prompt.
- **Demo-ready data:** fictional sample orders are created automatically when the database is initialized for the first time.
- **Health check:** `/health` endpoint for deployment checks.

## Live demo walkthrough

1. Open the [BizPilot AI live demo](https://bizpilot-ai-amd.onrender.com).
2. Review the overview metrics and sample order records.
3. Add a sample order, then change its status to see the dashboard update.
4. Ask the AI assistant: **“Summarize my business performance and suggest three practical next steps.”**
5. Try: **“Compare products by delivered revenue and explain the pending pipeline.”**

The hosted service may take a short time to wake up if it has been idle. AI responses require a valid Groq API key and an available model configured on the server. The dashboard and order manager work independently of the AI integration.

## How it works

1. The user records orders and updates their statuses.
2. BizPilot AI stores order records in SQLite.
3. The dashboard calculates business indicators from those records.
4. When a user asks a question, the application sends an aggregated business snapshot to the configured Groq model.
5. The assistant returns an explanation and recommendations based on the supplied data.

## Technology stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, Gunicorn |
| Database | SQLite |
| AI inference | Groq API |
| Frontend | HTML, CSS, JavaScript |
| Hosting | Render |

## Run locally

**Requirements:** Python 3.10 or newer.

```bash
git clone https://github.com/feresdouik/bizpilot-ai-amd.git
cd bizpilot-ai-amd
pip install -r requirements.txt
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

### Configure the AI assistant

Set these environment variables before starting the app:

- `GROQ_API_KEY` — your private Groq API key.
- `GROQ_MODEL` — a model currently available to your Groq account. If omitted, the app uses its configured default.

**Windows PowerShell:**

```powershell
$env:GROQ_API_KEY="your_groq_api_key"
$env:GROQ_MODEL="your_available_groq_model"
python app.py
```

The dashboard and order manager can run without the AI key; the assistant will explain that AI is not connected.

**Security:** Never commit API keys or other credentials to GitHub. Configure secrets as environment variables on your machine or hosting platform.

## Deploy on Render

1. Create a new **Web Service** and connect this GitHub repository.
2. **Build command:** `pip install -r requirements.txt`
3. **Start command:** `gunicorn app:app`
4. Add `GROQ_API_KEY` as a secret environment variable.
5. Set `GROQ_MODEL` to a model available to your Groq account.
6. Deploy and verify the `/health` endpoint.

## Data and reporting rules

- Initial records are fictional demo data, not real customer orders.
- **Delivered revenue** includes only orders with status `Delivered`.
- **Pipeline value** includes `Pending` and `Processing` orders; it is not earned revenue.
- **Cancelled** orders are excluded from delivered revenue and pipeline value.
- Amounts are interpreted as **USD**. The app does not perform currency conversion.
- Average delivered order value is delivered revenue divided by the number of delivered orders.

## Current limitations

- This is a working MVP prototype, not a production-grade business management system.
- The assistant provides analysis and recommendations. It does not execute payments, contact customers, or change order records through chat.
- The current data model does not collect costs, fees, advertising spend, inventory quantities, or sufficient dated history. Therefore, profit, margins, advertising ROI, stock availability, and reliable sales trends cannot be calculated.
- SQLite is used for the demonstration. On hosting platforms with ephemeral storage, records may reset after a restart or redeployment. A persistent managed database is recommended before production use.
- AI responses require a valid Groq API key and a model available to your account.
- The project uses hosted AI inference and does not require a local AMD GPU to run.

## Project status

**Working MVP with a live deployment.** Verify the live service and demo data before presenting.

## Team

**NexoraForge AI** — Solo project

Built by [Feres Douik](https://github.com/feresdouik).
