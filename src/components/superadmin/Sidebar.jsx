// apps/admin-dashboard/src/components/superadmin/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="logo">
        <div className="logo-icon"><span>D</span></div>
        <h2>DAKA <span>Express</span></h2>
        <p>Super Admin</p>
      </div>
      <ul className="menu">
        {menuItems.map(item => (
          <li key={item.id} className={isActive(item.path) ? 'active' : ''}>
            <a onClick={() => handleClick(item.path)}>
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}