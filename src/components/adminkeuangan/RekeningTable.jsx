// apps/admin-dashboard/src/components/adminkeuangan/RekeningTable.jsx
import React from 'react';

export default function RekeningTable({ rekening, onAdd, onDelete }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  if (rekening.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>Nama Bank</th><th>No Rekening</th><th>Atas Nama</th><th>Saldo</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada rekening</td></tr>
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
            <th>Nama Bank</th>
            <th>No Rekening</th>
            <th>Atas Nama</th>
            <th>Saldo</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rekening.map(acc => (
            <tr key={acc.id}>
              <td>{acc.bank}</td>
              <td>{acc.number}</td>
              <td>{acc.name}</td>
              <td>Rp {formatRupiah(acc.saldo)}</td>
              <td>
                <button className="btn-sm btn-danger" onClick={() => onDelete(acc.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}