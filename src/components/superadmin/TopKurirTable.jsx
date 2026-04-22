// apps/admin-dashboard/src/components/superadmin/TopKurirTable.jsx
import React from 'react';

export default function TopKurirTable({ topKurir }) {
  if (topKurir.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>No</th><th>Nama</th><th>Total Kirim</th><th>Rating</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Belum ada data kurir</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table style={{ width: '100%' }}>
        <thead>
          <tr><th>No</th><th>Nama</th><th>Total Kirim</th><th>Rating</th></tr>
        </thead>
        <tbody>
          {topKurir.map((kurir, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{kurir.name}</td>
              <td>{kurir.totalKirim}</td>
              <td>⭐ {kurir.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}