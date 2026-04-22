// apps/admin-dashboard/src/components/adminkurir/PickupTable.jsx
import React from 'react';

export default function PickupTable({ orders, kurirList, onAssign }) {
  if (orders.length === 0) {
    return (
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>No Resi</th><th>Pelanggan</th><th>Alamat Pickup</th><th>ShareLoc</th><th>Assign Kurir</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>✅ Semua order pickup sudah diassign ke kurir</td></tr>
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
            <th>Pelanggan</th>
            <th>Alamat Pickup</th>
            <th>ShareLoc</th>
            <th>Assign Kurir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td><strong>{order.noResi}</strong></td>
              <td>{order.pengirim}<br /><small>{order.pengirimTelp}</small></td>
              <td>{order.pengirimAlamat?.full || '-'}</td>
              <td>
                <a href={order.pengirimAlamat?.shareloc} target="_blank" rel="noopener noreferrer" style={{ color: '#F07B1A' }}>
                  Lihat Maps
                </a>
              </td>
              <td>
                <select id={`kurirSelectPickup_${order.id}`} className="kurir-select">
                  <option value="">Pilih Kurir</option>
                  {kurirList.map(k => (
                    <option key={k.id} value={k.id}>{k.name} ({k.area || '-'})</option>
                  ))}
                </select>
              </td>
              <td>
                <button className="btn-assign" onClick={() => onAssign(order, 'pickup', `kurirSelectPickup_${order.id}`)}>
                  Assign Kurir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}