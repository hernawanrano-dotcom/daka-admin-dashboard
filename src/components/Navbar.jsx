// apps/admin-dashboard/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({ user, onMenuClick, onLogout, onDarkModeToggle, darkMode, currentDate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = () => {
    const role = user?.role;
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admincs') return 'Admin CS';
    if (role === 'adminkurir') return 'Admin Kurir';
    if (role === 'adminkeuangan') return 'Admin Keuangan';
    return 'Admin';
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="page-info">
          <h1>{getRoleLabel()}</h1>
          <p>{currentDate}</p>
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={onDarkModeToggle}>
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        <div className="user-dropdown" ref={dropdownRef}>
          <button className="user-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="user-name">{user?.name}</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={onLogout} className="dropdown-item">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}