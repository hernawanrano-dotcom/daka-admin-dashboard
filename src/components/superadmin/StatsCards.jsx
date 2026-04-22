// apps/admin-dashboard/src/components/superadmin/StatsCards.jsx
import React from 'react';

export default function StatsCards({ stats }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const cards = [
    { label: 'Total Order', value: stats.totalOrders, icon: 'fa-box', color: '#0D9488', bg: '#e0f2fe' },
    { label: 'Pending', value: stats.pending, icon: 'fa-clock', color: '#F59E0B', bg: '#fef3c7' },
    { label: 'Terjadwal', value: stats.scheduled, icon: 'fa-calendar', color: '#059669', bg: '#d1fae5' },
    { label: 'Diambil Kurir', value: stats.picked, icon: 'fa-truck', color: '#c2410c', bg: '#fed7aa' },
    { label: 'Selesai', value: stats.delivered, icon: 'fa-check-circle', color: '#2563eb', bg: '#dbeafe' },
    { label: 'Pendapatan', value: `Rp ${formatRupiah(stats.totalRevenue)}`, icon: 'fa-money-bill', color: '#0D9488', bg: '#ccfbf1' },
    { label: 'On-time Delivery', value: `${stats.onTimeRate}%`, icon: 'fa-percent', color: '#9333ea', bg: '#fae8ff' },
    { label: 'Customer Aktif', value: stats.uniqueCustomers, icon: 'fa-users', color: '#0D9488', bg: '#f1f5f9' },
  ];

  return (
    <div className="superadmin-stats-grid">
      {cards.map(card => (
        <div key={card.label} className="superadmin-stat-card">
          <div className="stat-icon" style={{ backgroundColor: card.bg }}>
            <i className={`fas ${card.icon}`} style={{ color: card.color }}></i>
          </div>
          <div className="stat-info">
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}