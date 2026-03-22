export function LanguageToggle({ language, onChange, labels }) {
  return (
    <div className="language-toggle" role="group" aria-label="Language selector">
      <button
        className={language === "en" ? "active" : ""}
        type="button"
        onClick={() => onChange("en")}
      >
        {labels.english}
      </button>
      <button
        className={language === "de" ? "active" : ""}
        type="button"
        onClick={() => onChange("de")}
      >
        {labels.german}
      </button>
    </div>
  );
}
