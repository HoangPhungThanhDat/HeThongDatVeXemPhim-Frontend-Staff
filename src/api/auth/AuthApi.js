// src/api/auth/AuthApi.js
import AxiosAdmin from "api/client/AxiosAdmin";

const API_BASE = "http://localhost/api";

const AuthApi = {
  Login: (credentials) => AxiosAdmin.post("/staff/login", credentials),
  Logout: () => AxiosAdmin.post("/logout"),
  LogoutAll: () => AxiosAdmin.post("/auth/logout-all"),
  Refresh: () => AxiosAdmin.post("/auth/refresh"),
  Me: () => AxiosAdmin.get("/auth/me"),

  googleLogin: () => {
    window.location.href = `${API_BASE}/auth/google?app=staff`;
  },

  verifyGoogleToken: (token) =>
    AxiosAdmin.get(`/auth/google/check?token=${encodeURIComponent(token)}`),

  getGoogleAuthUrl: () => `${API_BASE}/auth/google?app=staff`,

  handleGoogleCallback: (token) => AuthApi.verifyGoogleToken(token),

  getProfile: () => AxiosAdmin.get("/profile"),
  updateProfile: (data) => AxiosAdmin.put("/profile", data),
  changePassword: (data) => AxiosAdmin.put("/change-password", data),
};

export default AuthApi;