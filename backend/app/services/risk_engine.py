from __future__ import annotations

from app.models.user_log import Language, PregnancyLogInput, RiskAssessment, RiskSeverity
from app.services.ai_explainer import build_clinical_explanation, build_patient_explanation, get_disclaimer
from app.services.rules_engine import evaluate_rules


SEVERITY_ORDER = {
    RiskSeverity.LOW: 0,
    RiskSeverity.MODERATE: 1,
    RiskSeverity.HIGH: 2,
}


RECOMMENDATIONS = {
    Language.EN: {
        RiskSeverity.LOW: "Continue monitoring and follow routine antenatal care.",
        RiskSeverity.MODERATE: "Consult your healthcare provider soon.",
        RiskSeverity.HIGH: "Seek immediate medical attention.",
    },
    Language.DE: {
        RiskSeverity.LOW: "Weiter beobachten und die regulaere Schwangerschaftsvorsorge fortsetzen.",
        RiskSeverity.MODERATE: "Bitte zeitnah Ihre behandelnde Fachperson kontaktieren.",
        RiskSeverity.HIGH: "Bitte sofort medizinische Hilfe in Anspruch nehmen.",
    },
}


def determine_overall_risk(factors) -> RiskSeverity:
    if not factors:
        return RiskSeverity.LOW
    highest = max(factors, key=lambda factor: SEVERITY_ORDER[factor.severity])
    return highest.severity


def assess_risk(log: PregnancyLogInput) -> RiskAssessment:
    factors = evaluate_rules(log)
    overall_risk = determine_overall_risk(factors)
    language = log.language
    patient_explanation = build_patient_explanation(overall_risk, factors, language)
    clinical_explanation = build_clinical_explanation(overall_risk, factors, language)
    sources = sorted({factor.source for factor in factors})
    data_source = "; ".join(sources) if sources else "WHO/CDC-informed monitoring baseline"

    return RiskAssessment(
        overall_risk=overall_risk,
        risk_factors=factors,
        recommendation=RECOMMENDATIONS[language][overall_risk],
        patient_explanation=patient_explanation,
        clinical_explanation=clinical_explanation,
        data_source=data_source,
        language=language,
        disclaimer=get_disclaimer(language),
        triggered_alert=overall_risk in {RiskSeverity.MODERATE, RiskSeverity.HIGH},
    )
