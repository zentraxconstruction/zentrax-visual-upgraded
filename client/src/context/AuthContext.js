import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // { id, name, email, role }
  const [token,   setToken]   = useState(() => localStorage.getItem("zx_token"));
  const [loading, setLoading] = useState(true);

  // Verify stored token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    console.log('[Auth] useEffect: token present on mount (preview):', token ? token.substring(0,20) + '...' : null);

    // Try regular user `/auth/me`, otherwise fallback to admin `/admin/auth/me`
    api.get("/auth/me")
      .then((data) => {
        if (data.success) setUser(data.user);
        else throw new Error(data.message || "No user");
      })
      .catch(async (err) => {
        try {
          const a = await api.get("/admin/auth/me");
          if (a.success && a.admin) {
            setUser({ id: a.admin._id || a.admin.id, name: a.admin.name || "Admin", email: a.admin.email, role: a.admin.role || "admin" });
            return;
          }
        } catch (_) {
          /* fallback */
        }
        clearAuth();
      })
      .finally(() => setLoading(false));
  }, [token]); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    email = email?.trim().toLowerCase();
    password = password?.trim();
    const data = await api.post("/auth/login", { email, password });
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("zx_token", data.token);
    console.log('[Auth] login: stored zx_token (preview):', data.token ? data.token.substring(0,20) + '...' : null);
    setToken(data.token);
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
    return data.role;
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    email = email?.trim().toLowerCase();
    password = password?.trim();
    const data = await api.post("/admin/auth/login", { email, password });
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("zx_token", data.token);
    setToken(data.token);
    setUser({ id: data.id, name: "Admin", email: data.email, role: data.role });
    return data.role;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.error("Logout error:", err);
    }
    clearAuth();
  }, []);

  function clearAuth() {
    localStorage.removeItem("zx_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
