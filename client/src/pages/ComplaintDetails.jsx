import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import api, { getErrorMessage } from "../services/api.js";

const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];
const uploadBaseUrl = import.meta.env.VITE_UPLOAD_BASE_URL || "http://localhost:5000";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ status: "Pending", assignedTo: "", adminResponse: "", message: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDetails() {
    setError("");
    try {
      const [complaintResponse, staffResponse] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get("/complaints/staff")
      ]);
      const loaded = complaintResponse.data.complaint;
      setComplaint(loaded);
      setStaff(staffResponse.data.users);
      setForm({
        status: loaded.status,
        assignedTo: loaded.assignedTo?._id || "",
        adminResponse: loaded.adminResponse || "",
        message: ""
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await api.patch(`/complaints/${id}`, form);
      setComplaint(response.data.complaint);
      setForm((current) => ({ ...current, message: "" }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (error && !complaint) return <div className="page"><p className="error-message">{error}</p></div>;
  if (!complaint) return <div className="page"><p className="status-card">Loading complaint...</p></div>;

  return (
    <div className="page details-page">
      <section className="details-panel">
        <div className="details-head">
          <div>
            <p className="eyebrow">{complaint.complaintId}</p>
            <h1>{complaint.category}</h1>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <dl className="details-grid">
          <div><dt>Villager</dt><dd>{complaint.villagerName}</dd></div>
          <div><dt>Phone</dt><dd>{complaint.phone}</dd></div>
          <div><dt>Village</dt><dd>{complaint.village}</dd></div>
          <div><dt>Ward</dt><dd>{complaint.ward}</dd></div>
          <div><dt>Address</dt><dd>{complaint.address}</dd></div>
          <div><dt>Assigned to</dt><dd>{complaint.assignedTo?.name || "Not assigned"}</dd></div>
          <div><dt>Created</dt><dd>{new Date(complaint.createdAt).toLocaleString()}</dd></div>
          <div><dt>Updated</dt><dd>{new Date(complaint.updatedAt).toLocaleString()}</dd></div>
        </dl>

        <div className="text-columns">
          <article><h2>Original text</h2><p>{complaint.originalText}</p></article>
          <article><h2>English translation</h2><p>{complaint.translatedEnglishText}</p></article>
        </div>

        {complaint.image?.url && (
          <figure className="complaint-photo">
            <img src={`${uploadBaseUrl}${complaint.image.url}`} alt="Complaint upload" />
          </figure>
        )}
      </section>

      <form className="form-surface update-panel" onSubmit={handleSubmit}>
        <h2>Update complaint</h2>
        <label>Status<select value={form.status} onChange={(e) => updateField("status", e.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Assign to Panchayat member
          <select value={form.assignedTo} onChange={(e) => updateField("assignedTo", e.target.value)}>
            <option value="">Not assigned</option>
            {staff.map((member) => <option key={member._id} value={member._id}>{member.name} - {member.village}</option>)}
          </select>
        </label>
        <label>Response visible to villager<textarea rows="4" value={form.adminResponse} onChange={(e) => updateField("adminResponse", e.target.value)} /></label>
        <label>Internal update note<textarea rows="3" value={form.message} onChange={(e) => updateField("message", e.target.value)} /></label>
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button big-button" disabled={saving}><Save size={22} /> {saving ? "Saving..." : "Save Update"}</button>
      </form>

      <section className="details-panel">
        <h2>Update history</h2>
        {complaint.updates?.length ? (
          <div className="timeline">
            {complaint.updates.map((item) => (
              <article key={item._id}>
                <StatusBadge status={item.status} />
                <p>{item.message || "Status updated"}</p>
                <small>{item.updatedByName} on {new Date(item.createdAt).toLocaleString()}</small>
              </article>
            ))}
          </div>
        ) : (
          <p>No updates have been recorded yet.</p>
        )}
      </section>
    </div>
  );
}
