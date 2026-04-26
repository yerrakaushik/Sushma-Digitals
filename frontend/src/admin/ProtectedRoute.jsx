import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — redirects to /admin/login if no token in sessionStorage
 */
export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
