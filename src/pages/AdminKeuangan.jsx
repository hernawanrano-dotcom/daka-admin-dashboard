// apps/admin-dashboard/src/pages/AdminKeuangan.jsx
import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useStaff } from '../hooks/useStaff';
import { useKeuangan } from '../hooks/useKeuangan';
import Sidebar from '../components/adminkeuangan/Sidebar';
import StatsCards from '../components/adminkeuangan/StatsCards';
import FinanceChart from '../components/adminkeuangan/FinanceChart';
import TransactionTable from '../components/adminkeuangan/TransactionTable';
import RekeningTable from '../components/adminkeuangan/RekeningTable';
import PengeluaranTable from '../components/adminkeuangan/PengeluaranTable';
import ReportGenerator from '../components/adminkeuangan/ReportGenerator';
import RekeningModal from '../components/adminkeuangan/RekeningModal';
import PengeluaranModal from '../components/adminkeuangan/PengeluaranModal';

export default function AdminKeuangan() {
  const { orders, customers, loadAllData } = useOrders();
  const { loadStaff } = useStaff();
  const {
    rekening,
    pengeluaran,
    addRekening,
    deleteRekening,
    addPengeluaran,
    deletePengeluaran,
    getTotalRevenue,
    getTotalPengeluaran,
    getNetProfit,
    getUnpaidAmount,
    getRevenueByMonth,
    getExpenseByMonth,
  } = useKeuangan(orders);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [rekeningModalOpen, setRekeningModalOpen] = useState(false);
  const [pengeluaranModalOpen, setPengeluaranModalOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadAllData();
    loadStaff();
  }, [loadAllData, loadStaff]);

  useEffect(() => {
    setRecentTransactions(orders.slice(0, 10));
  }, [orders]);

  const totalRevenue = getTotalRevenue();
  const totalPengeluaran = getTotalPengeluaran();
  const netProfit = getNetProfit();
  const unpaidAmount = getUnpaidAmount();

  const revenueByMonth = getRevenueByMonth();
  const expenseByMonth = getExpenseByMonth();

  const handleVerifyPayment = (order) => {
    alert(`Verifikasi pembayaran untuk ${order.noResi} telah diproses`);
  };

  const handleExportExcel = (startDate, endDate) => {
    const filteredOrders = orders.filter(o => o.tglOrder >= startDate && o.tglOrder <= endDate);
    let csv = "No Resi,Tanggal,Status,Pengirim,Penerima,Alamat,Nilai\n";
    filteredOrders.forEach(o => {
      csv += `"${o.noResi}","${o.tglOrder}","${o.status}","${o.pengirim}","${o.penerima}","${o.penerimaAlamat?.full?.replace(/"/g, '""') || '-'}","25000"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `daka_keuangan_${startDate}_to_${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPDF = (startDate, endDate) => {
    alert('Fitur export PDF akan segera tersedia');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('daka_darkmode', document.body.classList.contains('dark-mode'));
  };

  useEffect(() => {
    if (localStorage.getItem('daka_darkmode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <StatsCards
              revenue={totalRevenue}
              pengeluaran={totalPengeluaran}
              profit={netProfit}
              unpaid={unpaidAmount}
            />
            <FinanceChart revenueByMonth={revenueByMonth} expenseByMonth={expenseByMonth} />
            <div className="card">
              <h3><i className="fas fa-clock"></i> Transaksi Terbaru</h3>
              <TransactionTable
                orders={recentTransactions}
                customers={customers}
                filter="all"
                onVerify={handleVerifyPayment}
              />
            </div>
          </>
        );
      case 'transactions':
        return (
          <div className="card">
            <h3><i className="fas fa-exchange-alt"></i> Daftar Transaksi</h3>
            <div className="filter-bar" style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
              <button
                className={`filter-btn ${transactionFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('all')}
              >Semua</button>
              <button
                className={`filter-btn ${transactionFilter === 'unpaid' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('unpaid')}
              >Belum Bayar</button>
              <button
                className={`filter-btn ${transactionFilter === 'paid' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('paid')}
              >Sudah Bayar</button>
            </div>
            <TransactionTable
              orders={orders}
              customers={customers}
              filter={transactionFilter}
              onVerify={handleVerifyPayment}
            />
          </div>
        );
      case 'rekening':
        return (
          <div className="card">
            <h3><i className="fas fa-university"></i> Rekening Perusahaan</h3>
            <button className="btn-success btn-sm" onClick={() => setRekeningModalOpen(true)} style={{ marginBottom: '15px' }}>
              <i className="fas fa-plus"></i> Tambah Rekening
            </button>
            <RekeningTable
              rekening={rekening}
              onAdd={() => setRekeningModalOpen(true)}
              onDelete={deleteRekening}
            />
          </div>
        );
      case 'pengeluaran':
        return (
          <div className="card">
            <h3><i className="fas fa-money-bill-wave"></i> Pengeluaran Operasional</h3>
            <button className="btn-success btn-sm" onClick={() => setPengeluaranModalOpen(true)} style={{ marginBottom: '15px' }}>
              <i className="fas fa-plus"></i> Tambah Pengeluaran
            </button>
            <PengeluaranTable pengeluaran={pengeluaran} onDelete={deletePengeluaran} />
          </div>
        );
      case 'laporan':
        return (
          <div className="card">
            <h3><i className="fas fa-file-alt"></i> Laporan Keuangan</h3>
            <ReportGenerator
              orders={orders}
              pengeluaran={pengeluaran}
              onExportExcel={handleExportExcel}
              onExportPDF={handleExportPDF}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="keuangan-dashboard">
      <button className="keuangan-menu-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="keuangan-main-content">
        <div className="keuangan-top-bar">
          <div className="page-title">
            <h2>Admin Keuangan</h2>
            <p>Kelola keuangan & transaksi Daka Express</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div className="date-badge">{formatDate()}</div>
            <button className="dark-toggle" onClick={toggleDarkMode}>
              <i className="fas fa-moon"></i>
            </button>
          </div>
        </div>

        <div className="keuangan-main-container">
          {renderContent()}
        </div>
      </div>

      <RekeningModal
        isOpen={rekeningModalOpen}
        onClose={() => setRekeningModalOpen(false)}
        onSave={(bank, number, name, saldo) => addRekening(bank, number, name, saldo)}
      />

      <PengeluaranModal
        isOpen={pengeluaranModalOpen}
        onClose={() => setPengeluaranModalOpen(false)}
        onSave={(date, category, desc, amount) => addPengeluaran(date, category, desc, amount)}
      />
    </div>
  );
}