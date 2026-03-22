from __future__ import annotations

from app.models.user_log import Language, RiskFactor, RiskSeverity


DISCLAIMER = {
    Language.EN: "This is not a medical diagnosis. Consult a qualified healthcare professional.",
    Language.DE: "Dies ist keine medizinische Diagnose. Wenden Sie sich an qualifiziertes medizinisches Fachpersonal.",
}


RISK_TEXT = {
    Language.EN: {
        RiskSeverity.LOW: "No urgent warning sign was detected from the entered data.",
        RiskSeverity.MODERATE: "Some warning signs were detected and should be reviewed soon.",
        RiskSeverity.HIGH: "Urgent warning signs were detected and immediate assessment is advised.",
    },
    Language.DE: {
        RiskSeverity.LOW: "Anhand der eingegebenen Daten wurde kein akutes Warnzeichen erkannt.",
        RiskSeverity.MODERATE: "Es wurden Warnzeichen erkannt, die zeitnah medizinisch beurteilt werden sollten.",
        RiskSeverity.HIGH: "Es wurden dringende Warnzeichen erkannt, eine sofortige Abklärung wird empfohlen.",
    },
}


PATIENT_FACTOR_PREFIX = {
    Language.EN: "Important findings:",
    Language.DE: "Wichtige Befunde:",
}


CLINICAL_PREFIX = {
    Language.EN: "Triggered guideline-style rules:",
    Language.DE: "Ausgeloeste leitliniennahe Regeln:",
}


FACTOR_TRANSLATIONS = {
    "absent fetal movement": {Language.EN: "no fetal movement", Language.DE: "keine Kindsbewegungen"},
    "reduced fetal movement": {Language.EN: "reduced fetal movement", Language.DE: "verminderte Kindsbewegungen"},
    "heavy vaginal bleeding": {Language.EN: "heavy vaginal bleeding", Language.DE: "starke vaginale Blutung"},
    "bleeding with abdominal pain": {Language.EN: "bleeding with abdominal pain", Language.DE: "Blutung mit Bauchschmerzen"},
    "severe abdominal pain": {Language.EN: "severe abdominal pain", Language.DE: "starke Bauchschmerzen"},
    "elevated blood pressure": {Language.EN: "elevated blood pressure", Language.DE: "erhoehter Blutdruck"},
    "headache, vision changes, and high blood pressure": {
        Language.EN: "headache, vision changes, and high blood pressure",
        Language.DE: "Kopfschmerzen, Sehstörungen und hoher Blutdruck",
    },
    "swelling with elevated blood pressure": {
        Language.EN: "swelling with elevated blood pressure",
        Language.DE: "Schwellung mit erhoehtem Blutdruck",
    },
    "fever in pregnancy": {Language.EN: "fever in pregnancy", Language.DE: "Fieber in der Schwangerschaft"},
    "markedly elevated glucose": {Language.EN: "markedly elevated glucose", Language.DE: "deutlich erhoehter Glukosewert"},
}


def translate_factor_name(name: str, language: Language) -> str:
    return FACTOR_TRANSLATIONS.get(name, {}).get(language, name)


def build_patient_explanation(risk: RiskSeverity, factors: list[RiskFactor], language: Language) -> str:
    if not factors:
        return RISK_TEXT[language][risk]

    translated = ", ".join(translate_factor_name(factor.factor, language) for factor in factors[:3])
    if language == Language.DE:
        return f"{RISK_TEXT[language][risk]} {PATIENT_FACTOR_PREFIX[language]} {translated}. Bitte suchen Sie bei Verschlechterung sofort medizinische Hilfe."
    return f"{RISK_TEXT[language][risk]} {PATIENT_FACTOR_PREFIX[language]} {translated}. Seek urgent care if symptoms worsen or persist."


def build_clinical_explanation(risk: RiskSeverity, factors: list[RiskFactor], language: Language) -> str:
    if not factors:
        return RISK_TEXT[language][risk]

    rule_summary = "; ".join(
        f"{translate_factor_name(factor.factor, language)} [{factor.severity.value}, {factor.rule_id}]"
        for factor in factors
    )
    return f"{CLINICAL_PREFIX[language]} {rule_summary}."


def get_disclaimer(language: Language) -> str:
    return DISCLAIMER[language]
