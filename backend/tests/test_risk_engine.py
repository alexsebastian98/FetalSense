from app.models.user_log import BleedingLevel, FetalMovement, Language, PainLevel, PregnancyLogInput, RiskSeverity
from app.services.risk_engine import assess_risk


def test_absent_fetal_movement_is_high_risk():
    log = PregnancyLogInput(
        gestational_age=30,
        fetal_movement=FetalMovement.NONE,
        vaginal_bleeding=BleedingLevel.NONE,
        abdominal_pain=PainLevel.NONE,
        blood_pressure=120,
        swelling=False,
        headache=False,
        vision_changes=False,
        language=Language.EN,
    )

    assessment = assess_risk(log)

    assert assessment.overall_risk == RiskSeverity.HIGH
    assert any(factor.rule_id == "FM-002" for factor in assessment.risk_factors)


def test_hypertensive_cluster_is_high_risk():
    log = PregnancyLogInput(
        gestational_age=32,
        fetal_movement=FetalMovement.NORMAL,
        vaginal_bleeding=BleedingLevel.NONE,
        abdominal_pain=PainLevel.NONE,
        blood_pressure=150,
        swelling=True,
        headache=True,
        vision_changes=True,
        language=Language.DE,
    )

    assessment = assess_risk(log)

    assert assessment.overall_risk == RiskSeverity.HIGH
    assert assessment.language == Language.DE
    assert any(factor.rule_id == "BP-002" for factor in assessment.risk_factors)
