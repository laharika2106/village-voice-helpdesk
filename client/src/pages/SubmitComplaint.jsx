import { Camera, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import VoiceRecorder from "../components/VoiceRecorder.jsx";
import api, { getErrorMessage } from "../services/api.js";

const categories = [
  "Water problem",
  "Road problem",
  "Electricity problem",
  "Drainage problem",
  "Health issue",
  "Education issue",
  "Sanitation problem",
  "Government scheme issue",
  "Other"
];

const initialForm = {
  villagerName: "",
  phone: "",
  village: "",
  ward: "",
  category: "",
  originalText: "",
  translatedEnglishText: "",
  address: "",
  image: null
};

export default function SubmitComplaint() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [createdComplaint, setCreatedComplaint] = useState(null);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function translateText() {
    setError("");
    setTranslating(true);
    try {
      const response = await api.post("/complaints/translate", { text: form.originalText });
      updateField("translatedEnglishText", response.data.translatedEnglishText);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setTranslating(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const response = await api.post("/complaints", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCreatedComplaint(response.data.complaint);
      setForm(initialForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (createdComplaint) {
    return (
      <div className="page narrow">
        <section className="success-panel">
          <CheckCircle2 size={48} />
          <h1>Complaint submitted</h1>
          <p>Your complaint ID is</p>
          <strong className="complaint-id">{createdComplaint.complaintId}</strong>
          <StatusBadge status={createdComplaint.status} />
          <button className="primary-button big-button" onClick={() => setCreatedComplaint(null)}>
            Submit another complaint
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page form-page">
      <div className="page-heading">
        <p className="eyebrow">New complaint</p>
        <h1>Speak and submit your problem</h1>
      </div>

      <form className="form-surface" onSubmit={handleSubmit}>
        <VoiceRecorder
          value={form.originalText}
          onChange={(value) => updateField("originalText", value)}
          onTranslate={translateText}
          translating={translating}
        />

        <div className="field-grid">
          <label>Name<input required value={form.villagerName} onChange={(e) => updateField("villagerName", e.target.value)} /></label>
          <label>Phone number<input required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></label>
          <label>Village name<input required value={form.village} onChange={(e) => updateField("village", e.target.value)} /></label>
          <label>Ward number<input required value={form.ward} onChange={(e) => updateField("ward", e.target.value)} /></label>
          <label>Problem category
            <select required value={form.category} onChange={(e) => updateField("category", e.target.value)}>
              <option value="">Choose category</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>Location/address<input required value={form.address} onChange={(e) => updateField("address", e.target.value)} /></label>
        </div>

        <label>Original language text
          <textarea required rows="5" value={form.originalText} onChange={(e) => updateField("originalText", e.target.value)} />
        </label>
        <label>English translated text
          <textarea required rows="5" value={form.translatedEnglishText} onChange={(e) => updateField("translatedEnglishText", e.target.value)} />
        </label>
        <label className="file-input"><Camera size={22} /> Optional photo upload
          <input type="file" accept="image/*" onChange={(e) => updateField("image", e.target.files[0] || null)} />
        </label>

        {error && <p className="error-message">{error}</p>}
        <button className="primary-button big-button submit-button" disabled={submitting}>
          <Send size={22} /> {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
