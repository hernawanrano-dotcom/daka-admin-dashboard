// apps/admin-dashboard/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke halaman sesuai role masing-masing
    if (user.role === 'superadmin') return <Navigate to="/super-admin" replace />;
    if (user.role === 'admincs') return <Navigate to="/admin-cs" replace />;
    if (user.role === 'adminkurir') return <Navigate to="/admin-kurir" replace />;
    if (user.role === 'adminkeuangan') return <Navigate to="/admin-keuangan" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}