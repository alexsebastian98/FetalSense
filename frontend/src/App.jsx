import { useEffect, useState } from "react";
import { AlertBanner } from "./components/AlertBanner";
import { HistoryTimeline } from "./components/HistoryTimeline";
import { LanguageToggle } from "./components/LanguageToggle";
import { LogForm, defaultFormState } from "./components/LogForm";
import { RiskSummary } from "./components/RiskSummary";
import { createPregnancyLog, fetchHistorySummary, fetchPregnancyLogs } from "./services/api";

const copy = {
  en: {
    heroEyebrow: "Pregnancy Safety Dashboard",
    heroTitle: "Rule-based maternal risk monitoring for earlier warning detection.",
    heroText:
      "This prototype keeps risk classification deterministic and traceable. AI-style language support is limited to explanation, summarization, and translation.",
    english: "English",
    german: "Deutsch",
    formEyebrow: "Daily Check-In",
    formTitle: "Record symptoms and safety indicators",
    gestationalAge: "Gestational age (weeks)",
    fetalMovement: "Fetal movement",
    vaginalBleeding: "Vaginal bleeding",
    abdominalPain: "Abdominal pain",
    bloodPressure: "Blood pressure (systolic)",
    glucose: "Glucose level",
    temperature: "Temperature",
    swelling: "Swelling",
    headache: "Headache",
    visionChanges: "Vision changes",
    notes: "Notes",
    notesPlaceholder: "Optional symptoms or context",
    optional: "Optional",
    normal: "Normal",
    reduced: "Reduced",
    none: "None",
    mild: "Mild",
    heavy: "Heavy",
    severe: "Severe",
    submit: "Evaluate risk and save log",
    submitting: "Saving...",
    summaryEyebrow: "Assessment",
    summaryTitle: "Current risk result",
    summaryEmptyTitle: "No current assessment",
    summaryEmptyText: "Submit a daily log to generate a traceable risk result.",
    recommendation: "Recommendation",
    patientExplanation: "Patient explanation",
    clinicalExplanation: "Clinical explanation",
    dataSource: "Data source",
    riskFactors: "Triggered risk factors",
    noneDetected: "No risk factors detected from the configured rules.",
    alertTitle: "Alert status",
    historyEyebrow: "History",
    historyTitle: "Recent monitoring entries",
    trendEyebrow: "Trend",
    trendTitle: "14-day risk pattern",
    noHistory: "No history available yet.",
    totalLogs: "Logs",
    highRisk: "High risk",
    moderateRisk: "Moderate risk",
    loadError: "Unable to load data.",
  },
  de: {
    heroEyebrow: "Sicherheitsdashboard Schwangerschaft",
    heroTitle: "Regelbasierte Risikoerkennung fuer fruehere Warnsignale in der Schwangerschaft.",
    heroText:
      "Dieser Prototyp klassifiziert Risiken deterministisch und nachvollziehbar. KI-gestuetzte Funktionen sind auf Erklaerung, Zusammenfassung und Uebersetzung begrenzt.",
    english: "English",
    german: "Deutsch",
    formEyebrow: "Taeglicher Check",
    formTitle: "Symptome und Sicherheitsindikatoren erfassen",
    gestationalAge: "Schwangerschaftswoche",
    fetalMovement: "Kindsbewegungen",
    vaginalBleeding: "Vaginale Blutung",
    abdominalPain: "Bauchschmerzen",
    bloodPressure: "Blutdruck (systolisch)",
    glucose: "Glukosewert",
    temperature: "Temperatur",
    swelling: "Schwellung",
    headache: "Kopfschmerzen",
    visionChanges: "Sehstörungen",
    notes: "Notizen",
    notesPlaceholder: "Optionale Symptome oder Kontext",
    optional: "Optional",
    normal: "Normal",
    reduced: "Vermindert",
    none: "Keine",
    mild: "Leicht",
    heavy: "Stark",
    severe: "Stark",
    submit: "Risiko bewerten und Eintrag speichern",
    submitting: "Speichert...",
    summaryEyebrow: "Bewertung",
    summaryTitle: "Aktuelles Risikoergebnis",
    summaryEmptyTitle: "Noch keine Bewertung",
    summaryEmptyText: "Senden Sie einen taeglichen Eintrag, um ein nachvollziehbares Risikoergebnis zu erhalten.",
    recommendation: "Empfehlung",
    patientExplanation: "Erklaerung fuer Patientinnen",
    clinicalExplanation: "Klinische Erklaerung",
    dataSource: "Datenquelle",
    riskFactors: "Ausgeloeste Risikofaktoren",
    noneDetected: "Durch die konfigurierten Regeln wurden keine Risikofaktoren erkannt.",
    alertTitle: "Alarmstatus",
    historyEyebrow: "Verlauf",
    historyTitle: "Letzte Eintraege",
    trendEyebrow: "Trend",
    trendTitle: "14-Tage-Risikoverlauf",
    noHistory: "Noch keine Verlaufsdaten vorhanden.",
    totalLogs: "Eintraege",
    highRisk: "Hohes Risiko",
    moderateRisk: "Mittleres Risiko",
    loadError: "Daten konnten nicht geladen werden.",
  },
};

function sanitizePayload(form, language) {
  return {
    ...form,
    glucose_level: form.glucose_level === "" ? null : Number(form.glucose_level),
    temperature: form.temperature === "" ? null : Number(form.temperature),
    notes: form.notes.trim() || null,
    language,
  };
}

export default function App() {
  const [language, setLanguage] = useState("en");
  const [form, setForm] = useState(defaultFormState);
  const [assessment, setAssessment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labels = copy[language];

  async function refreshData() {
    try {
      const [historyLogs, historySummary] = await Promise.all([
        fetchPregnancyLogs(),
        fetchHistorySummary(),
      ]);
      setLogs(historyLogs);
      setSummary(historySummary);
    } catch {
      setError(labels.loadError);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [language]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const created = await createPregnancyLog(sanitizePayload(form, language));
      setAssessment(created.assessment);
      setForm(defaultFormState);
      await refreshData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{labels.heroEyebrow}</p>
          <h1>{labels.heroTitle}</h1>
          <p>{labels.heroText}</p>
        </div>
        <LanguageToggle language={language} onChange={setLanguage} labels={labels} />
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <AlertBanner assessment={assessment} copy={labels} />

      <main className="main-grid">
        <LogForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          labels={labels}
          isSubmitting={isSubmitting}
          language={language}
        />
        <RiskSummary assessment={assessment} copy={labels} />
      </main>

      <HistoryTimeline logs={logs} summary={summary} copy={labels} />
    </div>
  );
}
