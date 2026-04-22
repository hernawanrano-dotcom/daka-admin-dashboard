// apps/admin-dashboard/src/components/superadmin/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar({ onMenuClick, onExportExcel, onExportPDF, selectedPeriod, onPeriodChange, startDate, endDate, onCustomDate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const dropdownRef = useRef(null);
  const periodDropdownRef = useRef(null);

  useEffect(() => {
    setLocalStartDate(startDate || '');
    setLocalEndDate(endDate || '');
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
        setShowPeriodDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApplyCustom = () => {
    if (localStartDate && localEndDate) {
      onCustomDate(localStartDate, localEndDate);
      setShowPeriodDropdown(false);
    }
  };

  const periods = [
    { id: 'day', label: 'Hari Ini' },
    { id: 'week', label: 'Minggu Ini' },
    { id: 'month', label: 'Bulan Ini' },
    { id: 'year', label: 'Tahun Ini' },
  ];

  const getPeriodLabel = () => {
    if (selectedPeriod === 'custom') return 'Custom Date';
    const period = periods.find(p => p.id === selectedPeriod);
    return period ? period.label : 'Hari Ini';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('daka_darkmode', document.body.classList.contains('dark-mode'));
  };

  return (
    <div className="superadmin-navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="page-info">
          <h2>Dashboard</h2>
          <p>{formatDate()}</p>
        </div>
      </div>

      <div className="navbar-center">
        <div className="period-selector" ref={periodDropdownRef}>
          <button className="period-btn" onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}>
            <i className="fas fa-calendar-alt"></i> {getPeriodLabel()} <i className="fas fa-chevron-down"></i>
          </button>
          {showPeriodDropdown && (
            <div className="period-dropdown">
              {periods.map(p => (
                <button key={p.id} onClick={() => { onPeriodChange(p.id); setShowPeriodDropdown(false); }}>
                  {p.label}
                </button>
              ))}
              <div className="custom-date">
                <input type="date" value={localStartDate} onChange={(e) => setLocalStartDate(e.target.value)} />
                <span>sd</span>
                <input type="date" value={localEndDate} onChange={(e) => setLocalEndDate(e.target.value)} />
                <button onClick={handleApplyCustom}>Terapkan</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={onExportExcel} title="Export Excel">
          <i className="fas fa-file-excel"></i>
        </button>
        <button className="icon-btn" onClick={onExportPDF} title="Export PDF">
          <i className="fas fa-file-pdf"></i>
        </button>
        <button className="icon-btn" onClick={toggleDarkMode} title="Dark Mode">
          <i className="fas fa-moon"></i>
        </button>
        
        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="avatar">{user?.name?.charAt(0) || 'S'}</div>
            <span>{user?.name || 'Super Admin'}</span>
            <i className="fas fa-chevron-down"></i>
          </button>
          {showProfileDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.name || 'Super Admin'}</strong>
                <small>{user?.email || 'superadmin@daka.com'}</small>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}