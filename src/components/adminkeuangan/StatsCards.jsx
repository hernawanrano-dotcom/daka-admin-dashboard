// apps/admin-dashboard/src/components/adminkeuangan/StatsCards.jsx
import React from 'react';

export default function StatsCards({ revenue, pengeluaran, profit, unpaid }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const cards = [
    { label: 'Total Pendapatan', value: revenue, icon: 'fa-chart-line', color: '#0D9488' },
    { label: 'Total Pengeluaran', value: pengeluaran, icon: 'fa-money-bill-wave', color: '#ef4444' },
    { label: 'Laba Bersih', value: profit, icon: 'fa-chart-simple', color: '#10b981' },
    { label: 'Piutang (Belum Lunas)', value: unpaid, icon: 'fa-clock', color: '#F59E0B' },
  ];

  return (
    <div className="keuangan-stats-grid">
      {cards.map(card => (
        <div key={card.label} className="keuangan-stat-card">
          <div className="stat-icon" style={{ backgroundColor: `${card.color}20` }}>
            <i className={`fas ${card.icon}`} style={{ color: card.color }}></i>
          </div>
          <div className="stat-info">
            <h3>Rp {formatRupiah(card.value)}</h3>
            <p>{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}