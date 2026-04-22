// apps/admin-dashboard/src/layouts/SuperAdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/superadmin/Sidebar';

export default function SuperAdminLayout() {
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
    <div className="superadmin-container">
      <button className="superadmin-menu-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="superadmin-main-content">
        <div className="superadmin-top-bar">
          <div className="page-title">
            <h2>Super Admin</h2>
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