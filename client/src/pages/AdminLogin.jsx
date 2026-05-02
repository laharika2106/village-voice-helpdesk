import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(phone, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page narrow">
      <form className="form-surface login-card" onSubmit={handleSubmit}>
        <div className="page-heading compact">
          <p className="eyebrow">Secure staff access</p>
          <h1>Panchayat login</h1>
        </div>
        <label>Phone number<input required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label>Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button big-button" disabled={loading}><LogIn size={22} /> {loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
