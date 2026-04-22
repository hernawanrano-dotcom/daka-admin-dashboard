// apps/admin-dashboard/src/components/adminkurir/AssignModal.jsx
import React, { useState } from 'react';

export default function AssignModal({ isOpen, order, type, kurirList, selectedKurirId, onClose, onConfirm }) {
  const [selectedId, setSelectedId] = useState(selectedKurirId || '');

  if (!isOpen) return null;

  const selectedKurir = kurirList.find(k => k.id == selectedId);
  const typeText = type === 'pickup' ? 'Pickup' : 'Delivery';
  const address = type === 'pickup' ? order?.pengirimAlamat?.full : order?.penerimaAlamat?.full;

  const handleConfirm = () => {
    if (!selectedId) {
      alert('Pilih kurir terlebih dahulu!');
      return;
    }
    const kurir = kurirList.find(k => k.id == selectedId);
    onConfirm(selectedId, kurir?.name);
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Assign {typeText}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <strong>{order?.noResi}</strong>
          <br />
          Alamat: {address}
          <br />
          <strong>Kurir: {selectedKurir?.name || '-'}</strong>
        </div>
        
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '16px' }}
        >
          <option value="">Pilih Kurir</option>
          {kurirList.map(k => (
            <option key={k.id} value={k.id}>{k.name} ({k.area || '-'})</option>
          ))}
        </select>
        
        <div className="modal-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn-cancel" onClick={onClose}>Batal</button>
          <button className="btn-confirm" onClick={handleConfirm}>Assign</button>
        </div>
      </div>
    </div>
  );
}