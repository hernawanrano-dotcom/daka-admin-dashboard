// apps/admin-dashboard/src/components/adminkurir/Sidebar.jsx
import React from 'react';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'admin-kurir', icon: 'fas fa-motorcycle', label: 'Admin Kurir' },
    { id: 'kelola-kurir', icon: 'fas fa-users', label: 'Kelola Kurir' },
    { id: 'tracking', icon: 'fas fa-map', label: 'Tracking Order' },
  ];

  const handleClick = (id) => {
    // Untuk sementara, hanya admin-kurir yang aktif
    if (id === 'admin-kurir') {
      // sudah di halaman yang benar
    }
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <div className={`adminkurir-sidebar ${isOpen ? 'open' : ''}`} id="adminKurirSidebar">
      <div className="logo-area">
        <h2>DAKA <span>Express</span></h2>
        <p>Sameday Delivery • Jogja</p>
      </div>
      <ul className="menu">
        {menuItems.map(item => (
          <li key={item.id} className={item.id === 'admin-kurir' ? 'active' : ''}>
            <a onClick={() => handleClick(item.id)}>
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}