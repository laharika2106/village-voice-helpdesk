import { Home, LogIn, Search, ShieldCheck, Sprout } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-icon"><Sprout size={24} /></span>
          <span>Village Voice Helpdesk</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/"><Home size={18} /> Home</NavLink>
          <NavLink to="/submit">Submit</NavLink>
          <NavLink to="/track"><Search size={18} /> Track</NavLink>
          {user ? (
            <>
              <NavLink to="/admin/dashboard"><ShieldCheck size={18} /> Dashboard</NavLink>
              <button className="link-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/admin/login"><LogIn size={18} /> Staff Login</NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Built for village service teams to receive, track, and resolve real complaints.</span>
      </footer>
    </div>
  );
}
