function scoreToHeight(score) {
  return `${32 + score * 18}px`;
}

export function HistoryTimeline({ logs, summary, copy }) {
  return (
    <section className="timeline-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{copy.historyEyebrow}</p>
            <h2>{copy.historyTitle}</h2>
          </div>
        </div>

        <div className="history-list">
          {logs.length === 0 ? <p>{copy.noHistory}</p> : null}
          {logs.map((log) => (
            <article key={log.id} className="history-item">
              <div>
                <p>{new Date(log.created_at).toLocaleString()}</p>
                <strong>{log.assessment.overall_risk}</strong>
              </div>
              <p>{log.assessment.patient_explanation}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{copy.trendEyebrow}</p>
            <h2>{copy.trendTitle}</h2>
          </div>
        </div>

        <div className="metrics-row">
          <div>
            <span>{copy.totalLogs}</span>
            <strong>{summary?.total_logs ?? 0}</strong>
          </div>
          <div>
            <span>{copy.highRisk}</span>
            <strong>{summary?.high_risk_count ?? 0}</strong>
          </div>
          <div>
            <span>{copy.moderateRisk}</span>
            <strong>{summary?.moderate_risk_count ?? 0}</strong>
          </div>
        </div>

        <div className="trend-chart" aria-label="Risk trend chart">
          {(summary?.trend ?? []).map((point, index) => (
            <div key={`${point.date}-${index}`} className="trend-bar-wrap">
              <div
                className={`trend-bar trend-${point.risk.toLowerCase()}`}
                style={{ height: scoreToHeight(point.score) }}
                title={`${point.date}: ${point.risk}`}
              />
              <span>{point.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
