from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Language(str, Enum):
    EN = "en"
    DE = "de"


class FetalMovement(str, Enum):
    NORMAL = "normal"
    REDUCED = "reduced"
    NONE = "none"


class BleedingLevel(str, Enum):
    NONE = "none"
    MILD = "mild"
    HEAVY = "heavy"


class PainLevel(str, Enum):
    NONE = "none"
    MILD = "mild"
    SEVERE = "severe"


class RiskSeverity(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"


class PregnancyLogInput(BaseModel):
    gestational_age: int = Field(ge=1, le=45)
    fetal_movement: FetalMovement
    vaginal_bleeding: BleedingLevel
    abdominal_pain: PainLevel
    blood_pressure: int = Field(ge=60, le=260, description="Systolic blood pressure in mmHg")
    swelling: bool
    headache: bool
    vision_changes: bool
    glucose_level: Optional[float] = Field(default=None, ge=20, le=600)
    temperature: Optional[float] = Field(default=None, ge=34, le=43)
    notes: Optional[str] = Field(default=None, max_length=800)
    language: Language = Language.EN

    @field_validator("notes")
    @classmethod
    def normalize_notes(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class RiskFactor(BaseModel):
    factor: str
    severity: RiskSeverity
    reason: str
    rule_id: str
    source: str


class RiskAssessment(BaseModel):
    overall_risk: RiskSeverity
    risk_factors: list[RiskFactor]
    recommendation: str
    patient_explanation: str
    clinical_explanation: str
    data_source: str
    language: Language
    disclaimer: str
    triggered_alert: bool


class PregnancyLogRecord(PregnancyLogInput):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    assessment: RiskAssessment


class PregnancyLogResponse(BaseModel):
    id: str
    created_at: datetime
    input: PregnancyLogInput
    assessment: RiskAssessment


class TrendPoint(BaseModel):
    date: str
    risk: RiskSeverity
    score: int


class HistorySummary(BaseModel):
    total_logs: int
    high_risk_count: int
    moderate_risk_count: int
    low_risk_count: int
    trend: list[TrendPoint]
