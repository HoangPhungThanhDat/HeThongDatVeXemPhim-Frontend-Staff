// src/utils/auth.js
import AuthApi from "api/auth/AuthApi";

export const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullname");
  localStorage.removeItem("UserId");
  localStorage.removeItem("email");
};

export const saveAuthData = (accessToken, user) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("role", user.RoleName || "Staff");
  localStorage.setItem("fullname", user.FullName || "");
  localStorage.setItem("UserId", user.UserId || "");
  localStorage.setItem("email", user.Email || "");
};

// ⭐ Helper lấy token — dùng xuyên suốt
export const getToken = () => localStorage.getItem("access_token");

export const isAuthenticated = () => !!getToken();

export const logout = async () => {
  try {
    await AuthApi.Logout();
  } catch (e) {
    console.warn("Logout API failed:", e);
  } finally {
    clearAuthStorage();
    window.location.href = "/auth/signin";
  }
};

export const logoutAll = async () => {
  try {
    await AuthApi.LogoutAll();
  } catch (e) {
    console.warn("LogoutAll API failed:", e);
  } finally {
    clearAuthStorage();
    window.location.href = "/auth/signin";
  }
};