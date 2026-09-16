import axios from "axios";

/**
 * Central axios instance.
 *
 * The rest of the app currently talks to services/db.js (a mock,
 * localStorage-backed database) so it runs with zero setup. Once
 * the Express + MongoDB backend from the project spec is ready,
 * point REACT_APP_API_URL at it and swap the mock calls inside the
 * service files (authService, reservationService, etc.) for calls
 * through this `api` instance — the function signatures already
 * match what those services expect.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttw_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
