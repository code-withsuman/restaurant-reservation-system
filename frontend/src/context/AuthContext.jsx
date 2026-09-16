import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import reservationService from "../services/reservationService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  async function login(email, password) {
    const loggedIn = await authService.login(email, password);
    if (loggedIn.phone) await reservationService.claimByPhone(loggedIn.phone, loggedIn.id);
    setUser(loggedIn);
    return loggedIn;
  }

  async function register(payload) {
    const created = await authService.register(payload);
    if (created.phone) await reservationService.claimByPhone(created.phone, created.id);
    setUser(created);
    return created;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  async function updateProfile(patch) {
    const updated = await authService.updateProfile(user.id, patch);
    setUser(updated);
    return updated;
  }

  const value = { user, loading, login, register, logout, updateProfile, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
