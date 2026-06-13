import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => {
        setUser({ userId: data._id, role: data.role, name: data.name, email: data.email });
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
      })
      .catch(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userId, role, name) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name || "");
    setUser({ userId, role, name });
  };

  const logout = () => {
    return fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" }).finally(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
