import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');

  // If no token is found, redirect user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow access to the component
  return children;
};

export default ProtectedRoute;