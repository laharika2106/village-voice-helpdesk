import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vvh_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("vvh_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(phone, password) {
    const response = await api.post("/auth/login", { phone, password });
    localStorage.setItem("vvh_token", response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("vvh_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
