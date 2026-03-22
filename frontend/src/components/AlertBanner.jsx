export function AlertBanner({ assessment, copy }) {
  if (!assessment || !assessment.triggered_alert) {
    return null;
  }

  const tone = assessment.overall_risk === "HIGH" ? "alert-high" : "alert-moderate";

  return (
    <section className={`alert-banner ${tone}`}>
      <div>
        <p className="eyebrow">{copy.alertTitle}</p>
        <h2>{assessment.recommendation}</h2>
      </div>
      <p>{assessment.disclaimer}</p>
    </section>
  );
}
