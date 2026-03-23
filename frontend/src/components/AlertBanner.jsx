import { localizeAssessment } from "../services/assessmentLocalization";

export function AlertBanner({ assessment, copy, language }) {
  if (!assessment || !assessment.triggered_alert) {
    return null;
  }

  const localizedAssessment = localizeAssessment(assessment, language);

  const tone = localizedAssessment.overall_risk === "HIGH" ? "alert-high" : "alert-moderate";

  return (
    <section className={`alert-banner ${tone}`}>
      <div>
        <p className="eyebrow">{copy.alertTitle}</p>
        <h2>{localizedAssessment.recommendation}</h2>
      </div>
      <p>{localizedAssessment.disclaimer}</p>
    </section>
  );
}
