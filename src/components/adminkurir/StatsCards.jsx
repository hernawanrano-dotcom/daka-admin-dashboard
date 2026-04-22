// apps/admin-dashboard/src/components/adminkurir/StatsCards.jsx
import React from 'react';

export default function StatsCards({ stats }) {
  const cards = [
    { id: 'total', label: 'Total Order Hari Ini', value: stats.total, icon: 'fa-box', color: '#065493' },
    { id: 'pickup', label: 'Pickup (Belum Assign)', value: stats.pickupUnassign, icon: 'fa-hand-holding', color: '#F07B1A' },
    { id: 'delivery', label: 'Delivery (Belum Assign)', value: stats.deliveryUnassign, icon: 'fa-truck', color: '#F07B1A' },
    { id: 'assigned', label: 'Sudah Assign', value: stats.assigned, icon: 'fa-check-circle', color: '#10b981' },
  ];

  return (
    <div className="adminkurir-stats-grid">
      {cards.map(card => (
        <div key={card.id} className="adminkurir-stat-card">
          <div className="stat-info">
            <h4>{card.label}</h4>
            <div className="value">{card.value}</div>
          </div>
          <div className="stat-icon">
            <i className={`fas ${card.icon}`} style={{ color: card.color }}></i>
          </div>
        </div>
      ))}
    </div>
  );
}