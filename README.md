# BizPilot AI

**An AI-powered business operations assistant that helps small businesses understand their orders, track performance, and make better day-to-day decisions.**

Built by **NexoraForge AI** for the **AMD AI League**.

## The problem

Small businesses often manage orders manually and struggle to turn scattered order information into clear business insights. They may not know which products are generating delivered revenue, how much value is still tied up in pending orders, or which operational issues need attention.

## The solution

BizPilot AI brings order tracking, business metrics, and an AI assistant into one simple dashboard. It converts order records into a concise business snapshot and provides practical recommendations based on the available data.

## Key features

- **Business overview:** delivered revenue, total orders, orders needing attention, delivered order count, pipeline value, cancelled orders, and average delivered order value.
- **Order management:** add orders and update order statuses from the dashboard.
- **AI business analysis:** ask questions about business performance and receive structured summaries and recommendations.
- **Product performance:** compare products using delivered revenue while keeping pending and processing amounts separate.
- **Privacy-aware AI context:** aggregated business figures are sent to the AI assistant; customer names are excluded from its analysis prompt.
- **Clear reporting:** pending and processing orders are treated as pipeline value, not delivered revenue.
- **Demo-ready setup:** sample records are created automatically when the database is first initialized.
- **Health check:** a `/health` endpoint is available for deployment checks.

## How it works

1. The user records orders and updates their statuses.
2. BizPilot AI stores the order records in SQLite.
3. The dashboard calculates key business indicators from those records.
4. When the user asks a question, the application sends an aggregated business snapshot to the configured AI model.
5. The assistant returns an explanation and practical recommendations based on the available information.

## Technology stack

- **Backend:** Python, Flask, Gunicorn
- **Database:** SQLite
- **AI inference:** Groq API
- **Frontend:** HTML, CSS, JavaScript

## Live demo

https://bizpilot-ai-amd.onrender.com

## Source code

https://github.com/feresdouik/bizpilot-ai-amd

## Run locally

Requirements: Python 3.10 or newer.

1. Clone the repository:
   ```bash
   git clone https://github.com/feresdouik/bizpilot-ai-amd.git
   cd bizpilot-ai-amd
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your Groq credentials as environment variables. Set `GROQ_API_KEY` to your private API key and `GROQ_MODEL` to a model currently available to your Groq account.
4. Start the application:
   ```bash
   python app.py
   ```
5. Open http://localhost:5000 in your browser.

### Windows PowerShell example

```powershell
$env:GROQ_API_KEY="your_groq_api_key"
$env:GROQ_MODEL="your_available_groq_model"
python app.py
```

## Deploy on Render

1. Create a new **Web Service** and connect this GitHub repository.
2. Build command: `pip install -r requirements.txt`
3. Start command: `gunicorn app:app`
4. Add `GROQ_API_KEY` as a secret environment variable.
5. Set `GROQ_MODEL` to a model available to your Groq account.
6. Deploy the service and verify the `/health` endpoint.

## Data and reporting notes

- The initial records are sample data for demonstration; they are not real customer orders.
- Delivered revenue includes only orders whose status is `Delivered`.
- Pending and Processing orders contribute to pipeline value, not delivered revenue.
- All amounts in the current prototype are displayed and interpreted as **USD**. This is a reporting assumption, not a currency conversion.
- Average delivered order value is calculated as delivered revenue divided by the number of delivered orders. It is not calculated using pending orders.

## Current limitations

- This is an MVP prototype and is not yet a production-grade business management system.
- The assistant provides analysis and recommendations. It does not execute payments, contact customers, or change order records through chat.
- Profit, margins, advertising return, inventory levels, and sales trends require additional cost, advertising, inventory, and date data that the current MVP does not collect.
- SQLite is used for the demonstration. On hosting platforms with ephemeral storage, records may reset after a restart or redeployment. A persistent managed database is recommended before production use.
- AI responses require a valid Groq API key and an available model configured in the deployment environment.
- The current version uses hosted AI inference and does not require a local AMD GPU to run.

## Project status

**Working MVP with a live deployment.** The project is under active development; verify the live service and sample data before a presentation.

## Team

**NexoraForge AI** — Solo project
