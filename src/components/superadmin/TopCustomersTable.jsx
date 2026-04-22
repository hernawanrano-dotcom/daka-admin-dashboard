import React from 'react';

export default function TopCustomersTable({ topCustomers, customers }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  if (topCustomers.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Total Order</th>
              <th>Total Belanja</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Belum ada data</td>
            </tr>
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
            <th>No</th>
            <th>Nama</th>
            <th>Total Order</th>
            <th>Total Belanja</th>
          </tr>
        </thead>
        <tbody>
          {topCustomers.map((item, idx) => {
            const customer = customers.find(c => c.id === item.customerId);
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{customer?.name || 'Customer'}</td>
                <td>{item.totalOrders}</td>
                <td>Rp {formatRupiah(item.totalSpent)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}