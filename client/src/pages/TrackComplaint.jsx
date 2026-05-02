import { Search } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import api, { getErrorMessage } from "../services/api.js";

export default function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTrack(event) {
    event.preventDefault();
    setError("");
    setComplaint(null);
    setLoading(true);
    try {
      const response = await api.get(`/complaints/track/${complaintId.trim()}`);
      setComplaint(response.data.complaint);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page narrow">
      <section className="form-surface">
        <div className="page-heading compact">
          <p className="eyebrow">Track complaint</p>
          <h1>Check complaint status</h1>
        </div>
        <form className="track-form" onSubmit={handleTrack}>
          <label>Complaint ID<input required value={complaintId} onChange={(e) => setComplaintId(e.target.value)} placeholder="VVH-XXXXXXXXXX" /></label>
          <button className="primary-button big-button" disabled={loading}><Search size={22} /> {loading ? "Checking..." : "Track"}</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </section>

      {complaint && (
        <section className="details-panel">
          <div className="details-head">
            <div>
              <p className="eyebrow">{complaint.complaintId}</p>
              <h2>{complaint.category}</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <dl className="details-grid">
            <div><dt>Name</dt><dd>{complaint.villagerName}</dd></div>
            <div><dt>Village</dt><dd>{complaint.village}</dd></div>
            <div><dt>Ward</dt><dd>{complaint.ward}</dd></div>
            <div><dt>Submitted</dt><dd>{new Date(complaint.createdAt).toLocaleString()}</dd></div>
            <div><dt>Last updated</dt><dd>{new Date(complaint.updatedAt).toLocaleString()}</dd></div>
            <div><dt>Assigned to</dt><dd>{complaint.assignedTo?.name || "Not assigned yet"}</dd></div>
          </dl>
          <h3>Panchayat response</h3>
          <p>{complaint.adminResponse || "No response added yet."}</p>
        </section>
      )}
    </div>
  );
}
