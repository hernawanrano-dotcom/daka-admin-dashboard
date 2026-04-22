// apps/admin-dashboard/src/components/adminkeuangan/PengeluaranModal.jsx
import React, { useState } from 'react';

export default function PengeluaranModal({ isOpen, onClose, onSave }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Gaji');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date || !amount) {
      alert('Isi semua field!');
      return;
    }
    onSave(date, category, desc, amount);
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Gaji');
    setDesc('');
    setAmount('');
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Tambah Pengeluaran</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <div className="form-group">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div className="form-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <option value="Gaji">Gaji Karyawan</option>
            <option value="Bensin">Bensin</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Operasional">Operasional</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Deskripsi"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            placeholder="Jumlah (Rp)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <button className="btn-success" onClick={handleSubmit} style={{ width: '100%', padding: '12px' }}>
          Simpan
        </button>
      </div>
    </div>
  );
}