import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRoles = user?.roles || [];


  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
