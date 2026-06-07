import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { user_id, role, token }
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app boot
  useEffect(() => {
    const token  = localStorage.getItem("access_token");
    const role   = localStorage.getItem("user_role");
    const userId = localStorage.getItem("user_id");
    if (token && role && userId) {
      setUser({ token, role, user_id: Number(userId) });
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await authAPI.login(email, password);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_role",    data.role);
    localStorage.setItem("user_id",      String(data.user_id));
    setUser({ token: data.access_token, role: data.role, user_id: data.user_id });
    return data.role;
  }

  async function register(email, password, role) {
    const data = await authAPI.register(email, password, role);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_role",    data.role);
    localStorage.setItem("user_id",      String(data.user_id));
    setUser({ token: data.access_token, role: data.role, user_id: data.user_id });
    return data.role;
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
