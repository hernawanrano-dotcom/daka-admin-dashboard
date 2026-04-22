// apps/admin-dashboard/src/components/adminkeuangan/PengeluaranTable.jsx
import React from 'react';

export default function PengeluaranTable({ pengeluaran, onDelete }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  if (pengeluaran.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>Tanggal</th><th>Kategori</th><th>Deskripsi</th><th>Jumlah</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada pengeluaran</td></tr>
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
            <th>Kategori</th>
            <th>Deskripsi</th>
            <th>Jumlah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengeluaran.map(exp => (
            <tr key={exp.id}>
              <td>{exp.date}</td>
              <td>{exp.category}</td>
              <td>{exp.desc}</td>
              <td>Rp {formatRupiah(exp.amount)}</td>
              <td>
                <button className="btn-sm btn-danger" onClick={() => onDelete(exp.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}