import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // LocalStorage থেকে ইউজার তথ্য নিয়ে চেক

  if (!user) {
    return <Navigate to="/login" replace />; // লগইন না থাকলে /login পেজে রিডিরেক্ট
  }

  return children; // লগইন থাকলে চাইল্ড কম্পোনেন্ট দেখাবে
};

export default ProtectedRoute;
