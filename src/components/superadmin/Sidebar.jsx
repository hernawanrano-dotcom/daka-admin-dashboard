// apps/admin-dashboard/src/components/superadmin/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(!isOpen);

  const menuItems = [
    { id: 'dashboard', path: '/super-admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'admin-cs', path: '/super-admin/admin-cs', icon: 'fas fa-headset', label: 'Admin CS' },
    { id: 'admin-kurir', path: '/super-admin/admin-kurir', icon: 'fas fa-motorcycle', label: 'Admin Kurir' },
    { id: 'admin-keuangan', path: '/super-admin/admin-keuangan', icon: 'fas fa-chart-line', label: 'Admin Keuangan' },
  ];

  const handleClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) onClose();
  };

  const isActive = (path) => {
    if (path === '/super-admin') {
      return location.pathname === '/super-admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`superadmin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <h2>DAKA <span>Express</span></h2>
        </div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
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
  );
}