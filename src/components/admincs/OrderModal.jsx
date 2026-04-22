// apps/admin-dashboard/src/components/admincs/OrderModal.jsx
import React, { useState } from 'react';

export default function OrderModal({ isOpen, title, onClose, onConfirm, type, order }) {
  const [scheduleDay, setScheduleDay] = useState(order?.scheduleDay || 'Senin');
  const [scheduleDate, setScheduleDate] = useState(order?.scheduleDate || new Date().toISOString().split('T')[0]);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'schedule' || type === 'reschedule') {
      onConfirm({ scheduleDay, scheduleDate });
    } else if (type === 'cancel') {
      const fullReason = cancelNote ? `${cancelReason} - ${cancelNote}` : cancelReason;
      onConfirm({ cancelReason: fullReason });
    }
  };

  const renderContent = () => {
    if (type === 'schedule' || type === 'reschedule') {
      return (
        <>
          <div className="form-group">
            <label>Hari Pengiriman</label>
            <select
              value={scheduleDay}
              onChange={(e) => setScheduleDay(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '12px' }}
            >
              <option>Senin</option><option>Selasa</option><option>Rabu</option>
              <option>Kamis</option><option>Jumat</option><option>Sabtu</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tanggal Pengiriman</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '12px' }}
            />
          </div>
          <button className="btn-primary" onClick={handleConfirm}>
            {type === 'schedule' ? 'Jadwalkan' : 'Jadwalkan Ulang'}
          </button>
        </>
      );
    }

    if (type === 'cancel') {
      return (
        <>
          <div className="form-group">
            <label>Alasan Pembatalan</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '12px' }}
            >
              <option value="">Pilih alasan...</option>
              <option value="Permintaan customer">Permintaan customer</option>
              <option value="Kendala operasional">Kendala operasional</option>
              <option value="Alamat tidak valid">Alamat tidak valid</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="form-group">
            <label>Catatan</label>
            <textarea
              rows="2"
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              style={{ width: '100%', padding: '12px' }}
            />
          </div>
          <button className="btn-danger" onClick={handleConfirm}>Batalkan Order</button>
        </>
      );
    }

    return null;
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}