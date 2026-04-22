// apps/admin-dashboard/src/pages/SuperAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useStaff } from '../hooks/useStaff';
import { useDashboard } from '../hooks/useDashboard';
import Sidebar from '../components/superadmin/Sidebar';
import Navbar from '../components/superadmin/Navbar';
import StatsCards from '../components/superadmin/StatsCards';
import RevenueChart from '../components/superadmin/RevenueChart';
import OrdersChart from '../components/superadmin/OrdersChart';
import StatusChart from '../components/superadmin/StatusChart';
import ComparisonChart from '../components/superadmin/ComparisonChart';
import TopCustomersTable from '../components/superadmin/TopCustomersTable';
import TopKurirTable from '../components/superadmin/TopKurirTable';
import RecentOrdersTable from '../components/superadmin/RecentOrdersTable';
import MetricsTable from '../components/superadmin/MetricsTable';

export default function SuperAdmin() {
  const { orders, customers, loadAllData } = useOrders();
  const { staff, loadStaff } = useStaff();
  const {
    period,
    startDate,
    endDate,
    filteredOrders,
    stats,
    getRevenueByDate,
    getOrdersByDate,
    getTopCustomers,
    getTopKurir,
    getComparisonData,
    getMetrics,
    setPeriodFilter,
    setCustomDate,
  } = useDashboard(orders, customers, staff);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('day');

  useEffect(() => {
    loadAllData();
    loadStaff();
    const interval = setInterval(() => {
      loadAllData();
      loadStaff();
    }, 30000);
    setRefreshInterval(interval);
    return () => clearInterval(interval);
  }, [loadAllData, loadStaff]);

  const topCustomers = getTopCustomers(filteredOrders);
  const topKurir = getTopKurir();
  const { thisMonth, lastMonth } = getComparisonData();
  const metrics = getMetrics(filteredOrders, stats);

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    setPeriodFilter(newPeriod);
  };

  const handleCustomDate = (start, end) => {
    setCustomDate(start, end);
    setSelectedPeriod('custom');
  };

  const handleExportExcel = () => {
    let csv = "No Resi,Tanggal,Status,Pengirim,Penerima,Alamat,Nilai\n";
    filteredOrders.forEach(o => {
      csv += `"${o.noResi}","${o.tglOrder}","${o.status}","${o.pengirim}","${o.penerima}","${o.penerimaAlamat?.full?.replace(/"/g, '""') || '-'}","25000"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `daka_superadmin_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPDF = () => {
    alert('Fitur export PDF akan segera tersedia');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (localStorage.getItem('daka_darkmode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <div className="superadmin-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="superadmin-main">
        <Navbar 
          onMenuClick={toggleSidebar} 
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          startDate={startDate}
          endDate={endDate}
          onCustomDate={handleCustomDate}
        />
        
        <div className="superadmin-content">
          <StatsCards stats={stats} />
          
          <div className="superadmin-charts-grid">
            <RevenueChart orders={filteredOrders} getRevenueByDate={getRevenueByDate} />
            <OrdersChart orders={filteredOrders} getOrdersByDate={getOrdersByDate} />
            <StatusChart stats={stats} />
            <ComparisonChart thisMonth={thisMonth} lastMonth={lastMonth} />
          </div>

          <div className="superadmin-charts-grid">
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-trophy"></i> Top 10 Customer Teraktif</h3>
              </div>
              <TopCustomersTable topCustomers={topCustomers} customers={customers} />
            </div>
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-truck"></i> Top 10 Kurir Teraktif</h3>
              </div>
              <TopKurirTable topKurir={topKurir} />
            </div>
          </div>

          <div className="superadmin-charts-grid">
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-clock"></i> 10 Order Terbaru</h3>
              </div>
              <RecentOrdersTable orders={filteredOrders} />
            </div>
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-chart-simple"></i> Metrik Performa</h3>
              </div>
              <MetricsTable metrics={metrics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}