// apps/admin-dashboard/src/components/adminkeuangan/RekeningModal.jsx
import React, { useState } from 'react';

export default function RekeningModal({ isOpen, onClose, onSave }) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saldo, setSaldo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!bankName || !accountNumber || !accountName) {
      alert('Isi semua field!');
      return;
    }
    onSave(bankName, accountNumber, accountName, saldo);
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setSaldo('');
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Tambah Rekening</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Nama Bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="No Rekening"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Atas Nama"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            placeholder="Saldo"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
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