const RECOMMENDATIONS = {
  en: {
    LOW: "Continue monitoring and follow routine antenatal care.",
    MODERATE: "Consult your healthcare provider soon.",
    HIGH: "Seek immediate medical attention.",
  },
  de: {
    LOW: "Weiter beobachten und die regulaere Schwangerschaftsvorsorge fortsetzen.",
    MODERATE: "Bitte zeitnah Ihre behandelnde Fachperson kontaktieren.",
    HIGH: "Bitte sofort medizinische Hilfe in Anspruch nehmen.",
  },
};

const RISK_TEXT = {
  en: {
    LOW: "No urgent warning sign was detected from the entered data.",
    MODERATE: "Some warning signs were detected and should be reviewed soon.",
    HIGH: "Urgent warning signs were detected and immediate assessment is advised.",
  },
  de: {
    LOW: "Anhand der eingegebenen Daten wurde kein akutes Warnzeichen erkannt.",
    MODERATE: "Es wurden Warnzeichen erkannt, die zeitnah medizinisch beurteilt werden sollten.",
    HIGH: "Es wurden dringende Warnzeichen erkannt, eine sofortige Abklaerung wird empfohlen.",
  },
};

const DISCLAIMERS = {
  en: "This is not a medical diagnosis. Consult a qualified healthcare professional.",
  de: "Dies ist keine medizinische Diagnose. Wenden Sie sich an qualifiziertes medizinisches Fachpersonal.",
};

const PREFIX = {
  en: {
    patient: "Important findings:",
    clinical: "Triggered guideline-style rules:",
    suffix: "Seek urgent care if symptoms worsen or persist.",
    baselineSource: "WHO/CDC-informed monitoring baseline",
  },
  de: {
    patient: "Wichtige Befunde:",
    clinical: "Ausgeloeste leitliniennahe Regeln:",
    suffix: "Bitte suchen Sie bei Verschlechterung sofort medizinische Hilfe.",
    baselineSource: "WHO/CDC-informierte Monitoring-Basis",
  },
};

const SOURCE_TRANSLATIONS = {
  "WHO-informed antenatal danger-sign rule": {
    en: "WHO-informed antenatal danger-sign rule",
    de: "WHO-informierte Antenatal-Warnzeichen-Regel",
  },
  "CDC-informed maternal warning-sign rule": {
    en: "CDC-informed maternal warning-sign rule",
    de: "CDC-informierte maternale Warnzeichen-Regel",
  },
  "Clinical literature-informed validation rule": {
    en: "Clinical literature-informed validation rule",
    de: "Klinisch-literaturinformierte Validierungsregel",
  },
  "WHO/CDC-informed monitoring baseline": {
    en: "WHO/CDC-informed monitoring baseline",
    de: "WHO/CDC-informierte Monitoring-Basis",
  },
};

const FACTOR_BY_RULE = {
  "FM-002": {
    en: "no fetal movement",
    de: "keine Kindsbewegungen",
    reason: {
      en: "Possible fetal compromise requiring urgent evaluation.",
      de: "Moegliche fetale Gefaehrdung mit dringendem Abklaerungsbedarf.",
    },
  },
  "FM-001": {
    en: "reduced fetal movement",
    de: "verminderte Kindsbewegungen",
    reason: {
      en: "Reduced fetal movement can be an early warning sign and should prompt review.",
      de: "Verminderte Kindsbewegungen koennen ein fruehes Warnzeichen sein und sollten zeitnah geprueft werden.",
    },
  },
  "VB-002": {
    en: "heavy vaginal bleeding",
    de: "starke vaginale Blutung",
    reason: {
      en: "Heavy bleeding during pregnancy is treated as an emergency warning sign.",
      de: "Starke Blutung in der Schwangerschaft gilt als medizinisches Warnzeichen mit hoher Dringlichkeit.",
    },
  },
  "VB-003": {
    en: "bleeding with abdominal pain",
    de: "Blutung mit Bauchschmerzen",
    reason: {
      en: "Bleeding combined with pain raises concern for urgent obstetric complications.",
      de: "Blutung zusammen mit Schmerzen erhoeht den Verdacht auf dringliche geburtshilfliche Komplikationen.",
    },
  },
  "PA-001": {
    en: "severe abdominal pain",
    de: "starke Bauchschmerzen",
    reason: {
      en: "Severe abdominal pain requires prompt assessment in pregnancy.",
      de: "Starke Bauchschmerzen sollten in der Schwangerschaft zeitnah abgeklaert werden.",
    },
  },
  "BP-001": {
    en: "elevated blood pressure",
    de: "erhoehter Blutdruck",
    reason: {
      en: "Elevated blood pressure may indicate hypertensive risk and should be reviewed promptly.",
      de: "Erhoehter Blutdruck kann auf ein hypertensives Risiko hinweisen und sollte zeitnah geprueft werden.",
    },
  },
  "BP-002": {
    en: "headache, vision changes, and high blood pressure",
    de: "Kopfschmerzen, Sehveraenderungen und hoher Blutdruck",
    reason: {
      en: "This symptom cluster increases concern for preeclampsia and requires urgent assessment.",
      de: "Diese Symptomkonstellation erhoeht den Verdacht auf Praeeklampsie und erfordert eine dringende Abklaerung.",
    },
  },
  "BP-003": {
    en: "swelling with elevated blood pressure",
    de: "Schwellung mit erhoehtem Blutdruck",
    reason: {
      en: "Swelling alongside elevated blood pressure may reflect worsening hypertensive risk.",
      de: "Schwellung zusammen mit erhoehtem Blutdruck kann auf ein zunehmendes hypertensives Risiko hinweisen.",
    },
  },
  "TMP-001": {
    en: "fever in pregnancy",
    de: "Fieber in der Schwangerschaft",
    reason: {
      en: "Fever may indicate infection and should be discussed with a healthcare professional.",
      de: "Fieber kann auf eine Infektion hinweisen und sollte mit medizinischem Fachpersonal besprochen werden.",
    },
  },
  "GLU-001": {
    en: "markedly elevated glucose",
    de: "deutlich erhoehter Glukosewert",
    reason: {
      en: "High glucose may increase maternal-fetal risk and needs clinical follow-up.",
      de: "Ein hoher Glukosewert kann das maternale und fetale Risiko erhoehen und erfordert klinische Nachkontrolle.",
    },
  },
};

function normalizeLanguage(language) {
  return language === "de" ? "de" : "en";
}

function translateSource(source, language) {
  return SOURCE_TRANSLATIONS[source]?.[language] ?? source;
}

function localizeFactor(factor, language) {
  const mapped = FACTOR_BY_RULE[factor.rule_id];
  if (!mapped) {
    return {
      ...factor,
      source: translateSource(factor.source, language),
    };
  }

  return {
    ...factor,
    factor: mapped[language],
    reason: mapped.reason[language],
    source: translateSource(factor.source, language),
  };
}

function patientExplanation(assessment, language) {
  const factors = assessment.risk_factors ?? [];
  const risk = assessment.overall_risk;

  if (factors.length === 0) {
    return RISK_TEXT[language][risk] ?? assessment.patient_explanation;
  }

  const important = factors
    .slice(0, 3)
    .map((factor) => localizeFactor(factor, language).factor)
    .join(", ");

  return `${RISK_TEXT[language][risk]} ${PREFIX[language].patient} ${important}. ${PREFIX[language].suffix}`;
}

function clinicalExplanation(assessment, language) {
  const factors = assessment.risk_factors ?? [];
  const risk = assessment.overall_risk;

  if (factors.length === 0) {
    return RISK_TEXT[language][risk] ?? assessment.clinical_explanation;
  }

  const summary = factors
    .map((factor) => {
      const localized = localizeFactor(factor, language);
      return `${localized.factor} [${factor.severity}, ${factor.rule_id}]`;
    })
    .join("; ");

  return `${PREFIX[language].clinical} ${summary}.`;
}

function dataSource(assessment, language) {
  const factors = assessment.risk_factors ?? [];

  if (factors.length === 0) {
    return PREFIX[language].baselineSource;
  }

  const uniqueSources = [...new Set(factors.map((factor) => factor.source))];
  return uniqueSources.map((source) => translateSource(source, language)).join("; ");
}

export function localizeAssessment(assessment, language) {
  if (!assessment) {
    return assessment;
  }

  const normalizedLanguage = normalizeLanguage(language);

  return {
    ...assessment,
    language: normalizedLanguage,
    recommendation:
      RECOMMENDATIONS[normalizedLanguage][assessment.overall_risk] ?? assessment.recommendation,
    patient_explanation: patientExplanation(assessment, normalizedLanguage),
    clinical_explanation: clinicalExplanation(assessment, normalizedLanguage),
    data_source: dataSource(assessment, normalizedLanguage),
    disclaimer: DISCLAIMERS[normalizedLanguage] ?? assessment.disclaimer,
    risk_factors: (assessment.risk_factors ?? []).map((factor) =>
      localizeFactor(factor, normalizedLanguage),
    ),
  };
}
