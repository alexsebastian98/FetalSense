from __future__ import annotations

from collections.abc import Callable

from app.models.user_log import PregnancyLogInput, RiskFactor, RiskSeverity


SOURCE_WHO = "WHO-informed antenatal danger-sign rule"
SOURCE_CDC = "CDC-informed maternal warning-sign rule"
SOURCE_LITERATURE = "Clinical literature-informed validation rule"


RuleEvaluator = Callable[[PregnancyLogInput], RiskFactor | None]


def absent_fetal_movement_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.fetal_movement.value != "none":
        return None
    return RiskFactor(
        factor="absent fetal movement",
        severity=RiskSeverity.HIGH,
        reason="Possible fetal compromise requiring urgent evaluation.",
        rule_id="FM-002",
        source=SOURCE_WHO,
    )


def reduced_fetal_movement_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.fetal_movement.value != "reduced":
        return None
    return RiskFactor(
        factor="reduced fetal movement",
        severity=RiskSeverity.MODERATE,
        reason="Reduced fetal movement can be an early warning sign and should prompt review.",
        rule_id="FM-001",
        source=SOURCE_LITERATURE,
    )


def heavy_bleeding_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.vaginal_bleeding.value != "heavy":
        return None
    return RiskFactor(
        factor="heavy vaginal bleeding",
        severity=RiskSeverity.HIGH,
        reason="Heavy bleeding during pregnancy is treated as an emergency warning sign.",
        rule_id="VB-002",
        source=SOURCE_WHO,
    )


def bleeding_with_pain_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.vaginal_bleeding.value == "none" or log.abdominal_pain.value == "none":
        return None
    return RiskFactor(
        factor="bleeding with abdominal pain",
        severity=RiskSeverity.HIGH,
        reason="Bleeding combined with pain raises concern for urgent obstetric complications.",
        rule_id="VB-003",
        source=SOURCE_WHO,
    )


def severe_pain_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.abdominal_pain.value != "severe":
        return None
    return RiskFactor(
        factor="severe abdominal pain",
        severity=RiskSeverity.MODERATE,
        reason="Severe abdominal pain requires prompt assessment in pregnancy.",
        rule_id="PA-001",
        source=SOURCE_LITERATURE,
    )


def high_blood_pressure_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.blood_pressure < 140:
        return None
    severity = RiskSeverity.HIGH if log.blood_pressure >= 160 else RiskSeverity.MODERATE
    reason = (
        "Markedly elevated blood pressure may indicate severe hypertensive disease in pregnancy."
        if severity == RiskSeverity.HIGH
        else "Elevated blood pressure may indicate hypertensive risk and should be reviewed promptly."
    )
    return RiskFactor(
        factor="elevated blood pressure",
        severity=severity,
        reason=reason,
        rule_id="BP-001",
        source=SOURCE_CDC,
    )


def hypertensive_symptom_cluster_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if not (log.headache and log.vision_changes and log.blood_pressure >= 140):
        return None
    return RiskFactor(
        factor="headache, vision changes, and high blood pressure",
        severity=RiskSeverity.HIGH,
        reason="This symptom cluster increases concern for preeclampsia and requires urgent assessment.",
        rule_id="BP-002",
        source=SOURCE_CDC,
    )


def swelling_with_bp_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if not (log.swelling and log.blood_pressure >= 140):
        return None
    return RiskFactor(
        factor="swelling with elevated blood pressure",
        severity=RiskSeverity.MODERATE,
        reason="Swelling alongside elevated blood pressure may reflect worsening hypertensive risk.",
        rule_id="BP-003",
        source=SOURCE_CDC,
    )


def fever_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.temperature is None or log.temperature < 38.0:
        return None
    return RiskFactor(
        factor="fever in pregnancy",
        severity=RiskSeverity.MODERATE,
        reason="Fever may indicate infection and should be discussed with a healthcare professional.",
        rule_id="TMP-001",
        source=SOURCE_LITERATURE,
    )


def high_glucose_rule(log: PregnancyLogInput) -> RiskFactor | None:
    if log.glucose_level is None or log.glucose_level < 200:
        return None
    return RiskFactor(
        factor="markedly elevated glucose",
        severity=RiskSeverity.MODERATE,
        reason="High glucose may increase maternal-fetal risk and needs clinical follow-up.",
        rule_id="GLU-001",
        source=SOURCE_CDC,
    )


RULES: list[RuleEvaluator] = [
    absent_fetal_movement_rule,
    reduced_fetal_movement_rule,
    heavy_bleeding_rule,
    bleeding_with_pain_rule,
    severe_pain_rule,
    high_blood_pressure_rule,
    hypertensive_symptom_cluster_rule,
    swelling_with_bp_rule,
    fever_rule,
    high_glucose_rule,
]


def evaluate_rules(log: PregnancyLogInput) -> list[RiskFactor]:
    factors: list[RiskFactor] = []
    for rule in RULES:
        factor = rule(log)
        if factor is not None:
            factors.append(factor)
    return factors
