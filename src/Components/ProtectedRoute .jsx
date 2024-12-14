import React from 'react';
import { Navigate } from 'react-router-dom';
import { decryptData } from '../EncryptedPage';

const ProtectedRoute = ({ children }) => {
  const encryptedUser = localStorage.getItem("user");

  let user;
  if (encryptedUser) {
    try {
      user = decryptData(encryptedUser);
    } catch (error) {
      console.error("Error decrypting user data:", error);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
