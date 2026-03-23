import { localizeAssessment } from "../services/assessmentLocalization";

export function RiskSummary({ assessment, copy, language }) {
  if (!assessment) {
    return (
      <section className="panel summary-empty">
        <p className="eyebrow">{copy.summaryEyebrow}</p>
        <h2>{copy.summaryEmptyTitle}</h2>
        <p>{copy.summaryEmptyText}</p>
      </section>
    );
  }

  const localizedAssessment = localizeAssessment(assessment, language);

  return (
    <section className="panel summary-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{copy.summaryEyebrow}</p>
          <h2>{copy.summaryTitle}</h2>
        </div>
        <span className={`risk-pill risk-${localizedAssessment.overall_risk.toLowerCase()}`}>
          {localizedAssessment.overall_risk}
        </span>
      </div>

      <div className="summary-grid">
        <div>
          <h3>{copy.recommendation}</h3>
          <p>{localizedAssessment.recommendation}</p>
        </div>
        <div>
          <h3>{copy.patientExplanation}</h3>
          <p>{localizedAssessment.patient_explanation}</p>
        </div>
        <div>
          <h3>{copy.clinicalExplanation}</h3>
          <p>{localizedAssessment.clinical_explanation}</p>
        </div>
        <div>
          <h3>{copy.dataSource}</h3>
          <p>{localizedAssessment.data_source}</p>
        </div>
      </div>

      <div>
        <h3>{copy.riskFactors}</h3>
        <ul className="factor-list">
          {localizedAssessment.risk_factors.length === 0 ? <li>{copy.noneDetected}</li> : null}
          {localizedAssessment.risk_factors.map((factor) => (
            <li key={`${factor.rule_id}-${factor.factor}`}>
              <strong>{factor.factor}</strong>
              <span>{factor.severity}</span>
              <p>{factor.reason}</p>
              <small>{factor.source}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
