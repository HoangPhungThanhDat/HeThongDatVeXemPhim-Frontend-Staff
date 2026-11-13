// src/api/client/AxiosAdmin.js
import axios from "axios";
import { getToken, clearAuthStorage } from "utils/auth";

const BASE_URL = "http://localhost/api";

const AxiosAdmin = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

AxiosAdmin.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
};

AxiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      original._retry ||
      original.url?.includes("/auth/refresh") ||
      original.url?.includes("/login") ||
      original.url?.includes("/auth/google")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(AxiosAdmin(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data?.access_token || data?.token;
      if (!newToken) throw new Error("No token in refresh response");

      localStorage.setItem("access_token", newToken);
      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return AxiosAdmin(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearAuthStorage();
      if (!window.location.pathname.includes("/auth/sign-in")) {
        window.location.href = "/auth/sign-in";
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default AxiosAdmin;