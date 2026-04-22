// apps/admin-dashboard/src/components/adminkeuangan/ReportGenerator.jsx
import React, { useState } from 'react';

const ESTIMATED_PRICE = 25000;

export default function ReportGenerator({ orders, pengeluaran, onExportExcel, onExportPDF }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);

  const generateReport = () => {
    const filteredOrders = orders.filter(o => {
      const orderDate = o.tglOrder;
      return orderDate >= startDate && orderDate <= endDate;
    });

    const filteredPengeluaran = pengeluaran.filter(p => {
      return p.date >= startDate && p.date <= endDate;
    });

    const totalRevenue = filteredOrders.length * ESTIMATED_PRICE;
    const totalExpense = filteredPengeluaran.reduce((sum, p) => sum + p.amount, 0);
    const netProfit = totalRevenue - totalExpense;

    setReportData({
      startDate,
      endDate,
      orders: filteredOrders,
      pengeluaran: filteredPengeluaran,
      totalRevenue,
      totalExpense,
      netProfit,
      orderCount: filteredOrders.length,
      expenseCount: filteredPengeluaran.length,
    });
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <div>
      <div className="report-filters" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
        />
        <span>s/d</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
        />
        <button className="filter-btn" onClick={generateReport}>Generate Laporan</button>
        <button className="btn-excel" onClick={() => onExportExcel(startDate, endDate)}>
          <i className="fas fa-file-excel"></i> Export Excel
        </button>
        <button className="btn-pdf" onClick={() => onExportPDF(startDate, endDate)}>
          <i className="fas fa-file-pdf"></i> Export PDF
        </button>
      </div>

      {reportData && (
        <div className="report-result">
          <h4>Laporan Keuangan</h4>
          <p>Periode: {reportData.startDate} s/d {reportData.endDate}</p>
          
          <div className="report-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
            <div className="stat-card" style={{ padding: '16px', textAlign: 'center' }}>
              <h3>Rp {formatRupiah(reportData.totalRevenue)}</h3>
              <p>Total Pendapatan</p>
              <small>{reportData.orderCount} Order</small>
            </div>
            <div className="stat-card" style={{ padding: '16px', textAlign: 'center' }}>
              <h3>Rp {formatRupiah(reportData.totalExpense)}</h3>
              <p>Total Pengeluaran</p>
              <small>{reportData.expenseCount} Transaksi</small>
            </div>
            <div className="stat-card" style={{ padding: '16px', textAlign: 'center' }}>
              <h3>Rp {formatRupiah(reportData.netProfit)}</h3>
              <p>Laba Bersih</p>
            </div>
          </div>

          <div className="report-details" style={{ marginTop: '20px' }}>
            <h5>Detail Order</h5>
            <div className="table-wrapper">
              <table style={{ width: '100%', fontSize: '0.7rem' }}>
                <thead>
                  <tr><th>No Resi</th><th>Tanggal</th><th>Pengirim</th><th>Penerima</th><th>Status</th><th>Nilai</th></tr>
                </thead>
                <tbody>
                  {reportData.orders.slice(0, 10).map(o => (
                    <tr key={o.id}>
                      <td>{o.noResi}</td>
                      <td>{o.tglOrder}</td>
                      <td>{o.pengirim}</td>
                      <td>{o.penerima}</td>
                      <td>{o.status}</td>
                      <td>Rp {formatRupiah(ESTIMATED_PRICE)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}