import { Eye, Filter, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import api, { getErrorMessage } from "../services/api.js";

const categories = ["", "Water problem", "Road problem", "Electricity problem", "Drainage problem", "Health issue", "Education issue", "Sanitation problem", "Government scheme issue", "Other"];
const statuses = ["", "Pending", "In Progress", "Resolved", "Rejected"];

export default function AdminDashboard() {
  const [filters, setFilters] = useState({ village: "", ward: "", category: "", status: "" });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaints() {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const response = await api.get("/complaints", { params });
      setComplaints(response.data.complaints);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Complaints from villagers</h1>
      </div>

      <section className="filter-bar">
        <label>Village<input value={filters.village} onChange={(e) => updateFilter("village", e.target.value)} /></label>
        <label>Ward<input value={filters.ward} onChange={(e) => updateFilter("ward", e.target.value)} /></label>
        <label>Category<select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>{categories.map((item) => <option key={item} value={item}>{item || "All categories"}</option>)}</select></label>
        <label>Status<select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>{statuses.map((item) => <option key={item} value={item}>{item || "All statuses"}</option>)}</select></label>
        <button className="primary-button" onClick={loadComplaints}><Filter size={18} /> Apply</button>
        <button className="secondary-button" onClick={async () => {
          setFilters({ village: "", ward: "", category: "", status: "" });
          setLoading(true);
          setError("");
          try {
            const response = await api.get("/complaints");
            setComplaints(response.data.complaints);
          } catch (err) {
            setError(getErrorMessage(err));
          } finally {
            setLoading(false);
          }
        }}><RefreshCcw size={18} /> Reset</button>
      </section>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="status-card">Loading complaints...</p>
      ) : (
        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Villager</th>
                <th>Village</th>
                <th>Ward</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>{complaint.complaintId}</td>
                  <td>{complaint.villagerName}</td>
                  <td>{complaint.village}</td>
                  <td>{complaint.ward}</td>
                  <td>{complaint.category}</td>
                  <td><StatusBadge status={complaint.status} /></td>
                  <td>{new Date(complaint.updatedAt).toLocaleDateString()}</td>
                  <td><Link className="icon-link" to={`/admin/complaints/${complaint._id}`}><Eye size={18} /> View</Link></td>
                </tr>
              ))}
              {!complaints.length && (
                <tr><td colSpan="8" className="empty-cell">No complaints found in the database for these filters.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
