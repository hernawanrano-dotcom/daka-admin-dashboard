// apps/admin-dashboard/src/components/adminkurir/OrderListMap.jsx
import React from 'react';

export default function OrderListMap({ orders, onOrderClick }) {
  if (orders.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>✨ Tidak ada order hari ini ✨</div>;
  }

  return (
    <div className="order-list" id="orderListMap">
      {orders.map(order => (
        <div key={order.id} className="order-item" onClick={() => onOrderClick(order)}>
          <div className="order-resi">
            📦 {order.noResi} - {order.pengirim} → {order.penerima}
          </div>
          <div className="order-customer">
            Pickup: {order.pengirimAlamat?.full?.substring(0, 50) || '-'}
          </div>
          <div className="order-status">
            <span className={order.assignedPickupKurirId ? 'badge-assigned' : 'badge-unassigned'}>
              {order.assignedPickupKurirId ? `✓ Pickup: ${order.assignedPickupKurirName}` : '⚠️ Pickup Belum'}
            </span>
            <span className={order.assignedDeliveryKurirId ? 'badge-assigned' : 'badge-unassigned'} style={{ marginLeft: '8px' }}>
              {order.assignedDeliveryKurirId ? `✓ Delivery: ${order.assignedDeliveryKurirName}` : '⚠️ Delivery Belum'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}