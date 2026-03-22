const initialForm = {
  gestational_age: 24,
  fetal_movement: "normal",
  vaginal_bleeding: "none",
  abdominal_pain: "none",
  blood_pressure: 120,
  swelling: false,
  headache: false,
  vision_changes: false,
  glucose_level: "",
  temperature: "",
  notes: "",
};

export const defaultFormState = initialForm;

export function LogForm({ form, setForm, onSubmit, labels, isSubmitting, language }) {
  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{labels.formEyebrow}</p>
          <h2>{labels.formTitle}</h2>
        </div>
        <span className="pill">{language.toUpperCase()}</span>
      </div>

      <label>
        <span>{labels.gestationalAge}</span>
        <input
          type="number"
          min="1"
          max="45"
          value={form.gestational_age}
          onChange={(event) => updateField("gestational_age", Number(event.target.value))}
        />
      </label>

      <label>
        <span>{labels.fetalMovement}</span>
        <select
          value={form.fetal_movement}
          onChange={(event) => updateField("fetal_movement", event.target.value)}
        >
          <option value="normal">{labels.normal}</option>
          <option value="reduced">{labels.reduced}</option>
          <option value="none">{labels.none}</option>
        </select>
      </label>

      <label>
        <span>{labels.vaginalBleeding}</span>
        <select
          value={form.vaginal_bleeding}
          onChange={(event) => updateField("vaginal_bleeding", event.target.value)}
        >
          <option value="none">{labels.none}</option>
          <option value="mild">{labels.mild}</option>
          <option value="heavy">{labels.heavy}</option>
        </select>
      </label>

      <label>
        <span>{labels.abdominalPain}</span>
        <select
          value={form.abdominal_pain}
          onChange={(event) => updateField("abdominal_pain", event.target.value)}
        >
          <option value="none">{labels.none}</option>
          <option value="mild">{labels.mild}</option>
          <option value="severe">{labels.severe}</option>
        </select>
      </label>

      <label>
        <span>{labels.bloodPressure}</span>
        <input
          type="number"
          min="60"
          max="260"
          value={form.blood_pressure}
          onChange={(event) => updateField("blood_pressure", Number(event.target.value))}
        />
      </label>

      <label>
        <span>{labels.glucose}</span>
        <input
          type="number"
          step="0.1"
          value={form.glucose_level}
          onChange={(event) => updateField("glucose_level", event.target.value)}
          placeholder={labels.optional}
        />
      </label>

      <label>
        <span>{labels.temperature}</span>
        <input
          type="number"
          step="0.1"
          value={form.temperature}
          onChange={(event) => updateField("temperature", event.target.value)}
          placeholder={labels.optional}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.swelling}
          onChange={(event) => updateField("swelling", event.target.checked)}
        />
        <span>{labels.swelling}</span>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.headache}
          onChange={(event) => updateField("headache", event.target.checked)}
        />
        <span>{labels.headache}</span>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.vision_changes}
          onChange={(event) => updateField("vision_changes", event.target.checked)}
        />
        <span>{labels.visionChanges}</span>
      </label>

      <label className="form-span-full">
        <span>{labels.notes}</span>
        <textarea
          rows="4"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder={labels.notesPlaceholder}
        />
      </label>

      <button className="primary-button form-span-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
