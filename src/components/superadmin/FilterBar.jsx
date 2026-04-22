// apps/admin-dashboard/src/components/superadmin/FilterBar.jsx
import React, { useState } from 'react';

export default function FilterBar({ period, startDate, endDate, onPeriodChange, onCustomDate, onExportExcel, onExportPDF }) {
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  const handleApplyCustom = () => {
    if (localStartDate && localEndDate) {
      onCustomDate(localStartDate, localEndDate);
    }
  };

  return (
    <div className="superadmin-filter-bar">
      <div className="filter-group">
        <button
          className={`filter-btn ${period === 'day' ? 'active' : ''}`}
          onClick={() => onPeriodChange('day')}
        >Hari Ini</button>
        <button
          className={`filter-btn ${period === 'week' ? 'active' : ''}`}
          onClick={() => onPeriodChange('week')}
        >Minggu Ini</button>
        <button
          className={`filter-btn ${period === 'month' ? 'active' : ''}`}
          onClick={() => onPeriodChange('month')}
        >Bulan Ini</button>
        <button
          className={`filter-btn ${period === 'year' ? 'active' : ''}`}
          onClick={() => onPeriodChange('year')}
        >Tahun Ini</button>
      </div>

      <div className="date-range">
        <input
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <span>s/d</span>
        <input
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          placeholder="End Date"
        />
        <button className="filter-btn" onClick={handleApplyCustom}>Terapkan</button>
      </div>

      <div className="filter-group">
        <button className="btn-excel" onClick={onExportExcel}>
          <i className="fas fa-file-excel"></i> Excel
        </button>
        <button className="btn-pdf" onClick={onExportPDF}>
          <i className="fas fa-file-pdf"></i> PDF
        </button>
      </div>
    </div>
  );
}