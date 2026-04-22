// apps/admin-dashboard/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Menu berdasarkan role
  const getMenuItems = () => {
    const role = user?.role;

    // Super Admin: semua menu
    if (role === 'superadmin') {
      return [
        { id: 'dashboard', path: '/super-admin', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { id: 'admin-cs', path: '/super-admin/admin-cs', icon: 'fas fa-headset', label: 'Admin CS' },
        { id: 'admin-kurir', path: '/super-admin/admin-kurir', icon: 'fas fa-motorcycle', label: 'Admin Kurir' },
        { id: 'admin-keuangan', path: '/super-admin/admin-keuangan', icon: 'fas fa-chart-pie', label: 'Admin Keuangan' },
      ];
    }

    // Admin CS: hanya menu admin cs
    if (role === 'admincs') {
      return [
        { id: 'dashboard', path: '/admin-cs', icon: 'fas fa-headset', label: 'Admin CS' },
      ];
    }

    // Admin Kurir: hanya menu admin kurir
    if (role === 'adminkurir') {
      return [
        { id: 'dashboard', path: '/admin-kurir', icon: 'fas fa-motorcycle', label: 'Admin Kurir' },
      ];
    }

    // Admin Keuangan: hanya menu admin keuangan
    if (role === 'adminkeuangan') {
      return [
        { id: 'dashboard', path: '/admin-keuangan', icon: 'fas fa-chart-pie', label: 'Admin Keuangan' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) onClose();
  };

  const isActive = (path) => {
    if (path === '/super-admin' && location.pathname === '/super-admin') return true;
    if (path === '/admin-cs' && location.pathname === '/admin-cs') return true;
    if (path === '/admin-kurir' && location.pathname === '/admin-kurir') return true;
    if (path === '/admin-keuangan' && location.pathname === '/admin-keuangan') return true;
    if (path !== '/super-admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <div className="brand-text">
            <h2>DAKA</h2>
            <span>Express</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="version">
            <small>v2.0.0</small>
          </div>
        </div>
      </div>
    </>
  );
}