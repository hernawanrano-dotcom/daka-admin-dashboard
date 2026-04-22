// apps/admin-dashboard/src/components/adminkeuangan/TransactionTable.jsx
import React from 'react';

const ESTIMATED_PRICE = 25000;

export default function TransactionTable({ orders, customers, filter, onVerify }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  let filteredOrders = [...orders];

  if (filter === 'unpaid') {
    filteredOrders = filteredOrders.filter(o => o.status !== 'delivered' && o.status !== 'selesai');
  } else if (filter === 'paid') {
    filteredOrders = filteredOrders.filter(o => o.status === 'delivered' || o.status === 'selesai');
  } else if (filter === 'verified') {
    filteredOrders = filteredOrders.filter(o => o.status === 'delivered' || o.status === 'selesai');
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>Tanggal</th><th>No Resi</th><th>Customer</th><th>Pengirim</th><th>Penerima</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Tidak ada transaksi</td></tr>
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
            <th>Tanggal</th>
            <th>No Resi</th>
            <th>Customer</th>
            <th>Pengirim</th>
            <th>Penerima</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => {
            const customer = customers.find(c => c.id === order.customerId);
            const isPaid = order.status === 'delivered' || order.status === 'selesai';
            return (
              <tr key={order.id}>
                <td>{order.tglOrder}</td>
                <td>{order.noResi}</td>
                <td>{customer?.name || '-'}</td>
                <td>{order.pengirim}</td>
                <td>{order.penerima}</td>
                <td>Rp {formatRupiah(ESTIMATED_PRICE)}</td>
                <td>
                  <span className={`status-badge ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
                    {isPaid ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </td>
                <td>
                  <button className="btn-sm btn-warning" onClick={() => onVerify(order)}>
                    Verifikasi
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}