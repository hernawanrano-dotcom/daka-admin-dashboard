// apps/admin-dashboard/src/components/adminkeuangan/Sidebar.jsx
import React from 'react';

export default function Sidebar({ currentPage, onPageChange, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'transactions', icon: 'fas fa-exchange-alt', label: 'Transaksi' },
    { id: 'rekening', icon: 'fas fa-university', label: 'Rekening' },
    { id: 'pengeluaran', icon: 'fas fa-money-bill-wave', label: 'Pengeluaran' },
    { id: 'laporan', icon: 'fas fa-file-alt', label: 'Laporan' },
  ];

  const handleClick = (id) => {
    onPageChange(id);
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <div className={`keuangan-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo">
        <div className="logo-icon"><span>D</span></div>
        <h2>DAKA <span>Express</span></h2>
        <p>Admin Keuangan</p>
      </div>
      <ul className="menu">
        {menuItems.map(item => (
          <li key={item.id} className={currentPage === item.id ? 'active' : ''}>
            <a onClick={() => handleClick(item.id)}>
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}