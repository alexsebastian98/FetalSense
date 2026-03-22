# Pregnancy Risk Monitoring System

Pregnancy Risk Monitoring System is a clinically responsible decision-support prototype focused on pregnancy safety and early risk detection. It combines a rule-based risk engine derived from trusted maternal health guidance with a constrained explanation layer for patient-friendly and clinician-facing output.

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

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set MONGODB_URL=mongodb://localhost:27017
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. MongoDB

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
