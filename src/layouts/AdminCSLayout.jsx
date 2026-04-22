// apps/admin-dashboard/src/layouts/AdminCSLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminCSLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('daka_darkmode', document.body.classList.contains('dark-mode'));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="admincs-container">
      <button className="superadmin-menu-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="superadmin-main-content">
        <div className="superadmin-top-bar">
          <div className="page-title">
            <h2>Admin CS Panel</h2>
            <p>Selamat datang, {user?.name}</p>
          </div>
          <div className="header-right">
            <div className="date-badge">{formatDate()}</div>
            <button className="dark-toggle" onClick={toggleDarkMode}>
              <i className="fas fa-moon"></i>
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="superadmin-main-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}