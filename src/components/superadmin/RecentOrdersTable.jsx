// apps/admin-dashboard/src/components/superadmin/RecentOrdersTable.jsx
import React from 'react';

const ESTIMATED_PRICE_PER_ORDER = 25000;

const statusMap = {
  pending: 'Pending',
  scheduled: 'Terjadwal',
  dijadwalkan: 'Terjadwal',
  picked: 'Diambil Kurir',
  proses_pickup: 'Diambil Kurir',
  delivered: 'Selesai',
  selesai: 'Selesai',
};

const getStatusClass = (status) => {
  if (status === 'pending') return 'status-pending';
  if (status === 'scheduled' || status === 'dijadwalkan') return 'status-scheduled';
  if (status === 'picked' || status === 'proses_pickup') return 'status-picked';
  if (status === 'delivered' || status === 'selesai') return 'status-delivered';
  return 'status-pending';
};

export default function RecentOrdersTable({ orders }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const recentOrders = [...orders].reverse().slice(0, 10);

  if (recentOrders.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>No Resi</th><th>Tanggal</th><th>Pengirim</th><th>Penerima</th><th>Status</th><th>Nilai</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Belum ada order</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>No Resi</th>
            <th>Tanggal</th>
            <th>Pengirim</th>
            <th>Penerima</th>
            <th>Status</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map(order => (
            <tr key={order.id}>
              <td>{order.noResi}</td>
              <td>{order.tglOrder}</td>
              <td>{order.pengirim}</td>
              <td>{order.penerima}</td>
              <td>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </td>
              <td>Rp {formatRupiah(ESTIMATED_PRICE_PER_ORDER)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}