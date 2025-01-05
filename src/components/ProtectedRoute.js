import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { get } from "react-hook-form";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, role } = useAuth();

  console.log("isAuthenticated", isAuthenticated);
  console.log("requiredRole", role);
  console.log("role", requiredRoles);
  if (!isAuthenticated && isAuthenticated !== null) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
