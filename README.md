# FetalSense

FetalSense is a clinically responsible decision-support prototype focused on pregnancy safety and early risk detection. It combines a rule-based risk engine derived from trusted maternal health guidance with a constrained explanation layer for patient-friendly and clinician-facing output.

## Safety Principles

- Risk detection is fully rule-based.
- The application does not diagnose, prescribe, or replace medical care.
- AI-style explanation is limited to explanation, summarization, and translation support.
- Every triggered rule includes traceable reasoning and source attribution.

## Architecture

```text
User Input
-> Rule-Based Risk Engine (WHO / CDC / clinical literature inspired rules)
-> Risk Classification (LOW / MODERATE / HIGH)
-> Safe Explanation Layer (patient + clinical, EN/DE)
-> Dashboard + Timeline + Alerts
```

## How the App Works

1. User submits a daily pregnancy log from the frontend form.
2. Frontend sends the payload to `POST /api/logs`.
3. FastAPI validates all fields with strict schema constraints (ranges, enums, optional values).
4. Rule engine evaluates each clinical rule and returns triggered risk factors with:
  - severity,
  - reason,
  - rule id,
  - source category.
5. Risk engine derives overall risk (`LOW`, `MODERATE`, `HIGH`) from the highest triggered severity.
6. Explanation layer generates:
  - patient-facing explanation,
  - clinical explanation with rule ids,
  - language-specific disclaimer.
7. Backend stores the input and assessment in MongoDB with timestamp.
8. Frontend loads:
  - recent entries from `GET /api/logs`,
  - trend summary from `GET /api/history/summary`.
9. History and Trend UI update immediately after each successful submission.

## Why It Is Reliable

- Deterministic decisions: risk classification is rule-based, not LLM-generated.
- Transparent outputs: every triggered factor includes `rule_id`, rationale, and source.
- Strong input validation: Pydantic enforces type and safety bounds (for example blood pressure, temperature, gestational age).
- Conservative triage logic: urgent warning-sign combinations are explicitly encoded as high-priority rules.
- Reproducible behavior: same input always produces the same risk output.
- Separation of concerns: rule evaluation, risk aggregation, and explanation generation are separate modules, reducing coupling and regression risk.
- API-level protections: bounded query limits on history endpoints help stability under normal use.
- Automated checks: backend includes tests for critical high-risk scenarios.

Reliability scope:

- This is reliable as a transparent decision-support prototype.
- It is not a diagnostic medical device and must not replace clinical judgment.

## Backend

- FastAPI
- MongoDB via Motor
- Traceable rules in `backend/app/services/rules_engine.py`
- Risk aggregation in `backend/app/services/risk_engine.py`
- Safe multilingual explanations in `backend/app/services/ai_explainer.py`

## Frontend

- React with Vite
- Mobile-friendly single-page dashboard
- Daily log submission
- Risk summary cards
- History timeline and simple trend view
- English / German language toggle

## Clinical Rule Sources

The prototype maps the following source categories into code:

- WHO pregnancy and antenatal care warning-sign guidance
- CDC maternal warning signs and hypertensive risk guidance
- Clinical literature references used for conservative validation of warning signs such as reduced fetal movement, vaginal bleeding, fever, and hypertensive symptom clusters

The exact textual wording of clinical guidelines is not reproduced. Instead, the system translates high-level warning sign patterns into transparent code rules.

## Project Structure

```text
backend/
  app/
    api/routes.py
    db/mongodb.py
    models/user_log.py
    services/rules_engine.py
    services/risk_engine.py
    services/ai_explainer.py
  main.py
frontend/
  src/
    components/
    services/api.js
    App.jsx
```

## Setup

### 1. Start MongoDB

Option A (recommended): Docker Compose from project root.

```bash
docker compose up -d
```

Option B: run your local MongoDB service on port `27017`.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend environment configuration:

1. Copy `.env.example` to `.env` in `backend/`.
2. Edit values if needed:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=pregnancy_monitor
```

The backend now loads `backend/.env` automatically.

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok"}
```

Run backend tests:

```bash
cd backend
.venv\Scripts\activate
pytest -q
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend environment configuration (optional but recommended):

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If not set, the frontend uses `http://127.0.0.1:8000` by default.

Build check:

```bash
cd frontend
npm run build
```

### 4. Verify End-to-End Flow

1. Open frontend dev URL (usually `http://127.0.0.1:5173`).
2. Submit a daily log.
3. Confirm:
- assessment card updates,
- history timeline shows the new entry,
- no API errors appear in UI.

## Troubleshooting

- If frontend shows network errors, verify backend is running on `127.0.0.1:8000`.
- If backend cannot save logs, verify MongoDB is reachable at `MONGODB_URL`.
- If Docker MongoDB is running but backend still fails, restart backend after editing `.env`.
- If port conflicts occur, update `MONGODB_URL` and/or `VITE_API_BASE_URL` accordingly.

### MongoDB Notes

Run a local MongoDB instance on the default port or update `MONGODB_URL`.

## Example API Response

```json
{
  "overall_risk": "HIGH",
  "risk_factors": [
    {
      "factor": "absent fetal movement",
      "severity": "HIGH",
      "reason": "Possible fetal compromise requiring urgent evaluation.",
      "source": "WHO-informed warning sign rule"
    }
  ],
  "recommendation": "Seek immediate medical attention",
  "patient_explanation": "No fetal movement can be an urgent warning sign. Please seek immediate medical care.",
  "clinical_explanation": "Absent fetal movement is treated as a high-risk trigger due to possible fetal compromise and should prompt urgent assessment.",
  "language": "en",
  "disclaimer": "This is not a medical diagnosis. Consult a qualified healthcare professional."
}
```

## Notes

- This is a prototype for education, triage support, and interview demonstration.
- Production use would require clinical governance, versioned guideline review, validation, audit logging, security hardening, and regulatory assessment.
