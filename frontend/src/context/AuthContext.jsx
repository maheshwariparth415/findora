import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("findora_user");
    const token = localStorage.getItem("findora_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
      if (!USE_MOCK) {
        api.get("/auth/me")
          .then(({ data }) => {
            setUser(data.user);
            localStorage.setItem("findora_user", JSON.stringify(data.user));
          })
          .catch(() => {
            localStorage.removeItem("findora_user");
            localStorage.removeItem("findora_token");
            setUser(null);
          })
          .finally(() => setLoading(false));
        return;
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem("findora_user", JSON.stringify(nextUser));
    if (token) localStorage.setItem("findora_token", token);
  };

  const login = async ({ email, password }) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const isAdmin = email.toLowerCase().includes("admin");
      const mockUser = { id: "u1", name: isAdmin ? "Admin User" : email.split("@")[0], email, role: isAdmin ? "admin" : "user", avatarUrl: "" };
      persist(mockUser, "mock-jwt-token");
      return mockUser;
    }
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.user, data.token);
    return data.user;
  };

  const register = async ({ name, email, password }) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const mockUser = { id: "u_" + Date.now(), name, email, role: "user", avatarUrl: "" };
      persist(mockUser, "mock-jwt-token");
      return mockUser;
    }
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("findora_user");
    localStorage.removeItem("findora_token");
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
