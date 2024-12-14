import React from "react";
import { Navigate } from "react-router-dom";
import { decryptData } from "../EncryptedPage";

const PrivateRoute = ({ children, allowedRoles }) => {
  const encryptedUser = localStorage.getItem("user");

  let user;
  if (encryptedUser) {
    try {
      user = decryptData(encryptedUser);
    } catch (error) {
      console.error("Error decrypting user data:", error);
    }
  }
  const userRoles = user?.roles || [];


  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/" />;
};

export default PrivateRoute;
