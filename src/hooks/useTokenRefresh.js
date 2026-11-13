// src/hooks/useTokenRefresh.js
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import AuthApi from "api/auth/AuthApi";
import { getToken, clearAuthStorage } from "utils/auth";

export default function useTokenRefresh() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const checkAndRefresh = async () => {
      if (isRefreshingRef.current) return;
      const token = getToken();
      if (!token) return;

      try {
        const { exp } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        const secondsLeft = exp - now;

        if (secondsLeft < 120 && secondsLeft > -60) {
          isRefreshingRef.current = true;
          try {
            const { data } = await AuthApi.Refresh();
            const newToken = data?.access_token || data?.token;
            if (newToken) {
              localStorage.setItem("access_token", newToken);
              console.log("✅ Token refreshed");
            }
          } catch (e) {
            if (e.response?.status === 401) {
              clearAuthStorage();
              if (!window.location.pathname.includes("/auth/sign-in")) {
                window.location.href = "/auth/sign-in";
              }
            }
          } finally {
            isRefreshingRef.current = false;
          }
        }
      } catch (e) {
        clearAuthStorage();
        if (!window.location.pathname.includes("/auth/sign-in")) {
          window.location.href = "/auth/sign-in";
        }
      }
    };

    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}