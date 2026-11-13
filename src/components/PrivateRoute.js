// src/components/PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken, clearAuthStorage } from "utils/auth";

const PrivateRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const roleName = decoded.role || decoded.RoleName;

    if (roleName !== "Staff") {
      clearAuthStorage();
      return <Navigate to="/auth/sign-in" replace />;
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      clearAuthStorage();
      return <Navigate to="/auth/sign-in" replace />;
    }
  } catch (e) {
    clearAuthStorage();
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute;