// apps/admin-dashboard/src/components/admincs/OrderTable.jsx
import React from 'react';

const statusMap = {
  diterima: 'Diterima',
  dijadwalkan: 'Dijadwalkan',
  proses_pickup: 'Proses Pickup',
  proses_delivery: 'Proses Delivery',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

const getStatusClass = (status) => `status-${status}`;

export default function OrderTable({ orders, onSchedule, onReschedule, onCancel }) {
  if (orders.length === 0) {
    return (
      <div className="order-table">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>No Resi</th><th>Pengirim</th><th>Penerima</th><th>Jadwal</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada order</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="order-table">
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>No Resi</th><th>Pengirim</th><th>Penerima</th><th>Jadwal</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.noResi}</td>
              <td>{order.pengirim}</td>
              <td>{order.penerima}</td>
              <td>{order.scheduleDay || '-'}, {order.scheduleDate || '-'}</td>
              <td>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </td>
              <td>
                {order.status === 'diterima' && (
                  <button className="btn-sm btn-edit" onClick={() => onSchedule(order)}>Jadwalkan</button>
                )}
                {order.status === 'dijadwalkan' && (
                  <button className="btn-sm btn-edit" onClick={() => onReschedule(order)}>Jadwal Ulang</button>
                )}
                {(order.status === 'diterima' || order.status === 'dijadwalkan') && (
                  <button className="btn-sm btn-danger" onClick={() => onCancel(order)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}