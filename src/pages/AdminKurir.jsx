// apps/admin-dashboard/src/pages/AdminKurir.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useStaff } from '../hooks/useStaff';
import { orderAPI } from '../services/api';
import Sidebar from '../components/adminkurir/Sidebar';
import StatsCards from '../components/adminkurir/StatsCards';
import OrderMap from '../components/adminkurir/OrderMap';
import OrderListMap from '../components/adminkurir/OrderListMap';
import PickupTable from '../components/adminkurir/PickupTable';
import DeliveryTable from '../components/adminkurir/DeliveryTable';
import AssignModal from '../components/adminkurir/AssignModal';

export default function AdminKurir() {
  const { orders, loadAllData } = useOrders();
  const { kurirList, loadStaff } = useStaff();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pickup');
  const [assignModal, setAssignModal] = useState({ isOpen: false, order: null, type: null, selectedKurirId: null });
  const [refreshInterval, setRefreshInterval] = useState(null);

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

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    return dateStr === new Date().toISOString().split('T')[0];
  };

  const todayOrders = orders.filter(o => isToday(o.scheduleDate) && o.status !== 'dibatalkan');

  const stats = {
    total: todayOrders.length,
    pickupUnassign: todayOrders.filter(o => !o.assignedPickupKurirId).length,
    deliveryUnassign: todayOrders.filter(o => !o.assignedDeliveryKurirId).length,
    assigned: todayOrders.filter(o => o.assignedPickupKurirId || o.assignedDeliveryKurirId).length,
  };

  const pickupUnassignOrders = todayOrders.filter(o => !o.assignedPickupKurirId);
  const deliveryUnassignOrders = todayOrders.filter(o => !o.assignedDeliveryKurirId);

  const handleAssign = (order, type, selectId) => {
    const select = document.getElementById(selectId);
    const selectedKurirId = select ? select.value : '';
    setAssignModal({
      isOpen: true,
      order,
      type,
      selectedKurirId,
    });
  };

  const handleConfirmAssign = async (kurirId, kurirName) => {
    const { order, type } = assignModal;
    const assignField = type === 'pickup' ? 'assignedPickupKurirId' : 'assignedDeliveryKurirId';
    const assignNameField = type === 'pickup' ? 'assignedPickupKurirName' : 'assignedDeliveryKurirName';

    const body = { orderId: order.id };
    body[assignField] = parseInt(kurirId);
    body[assignNameField] = kurirName;
    body.note = `👤 Kurir ${kurirName} ditugaskan untuk ${type.toUpperCase()}`;

    const res = await orderAPI.updateStatus(body);
    if (res?.success) {
      alert(`✅ ${order.noResi} berhasil diassign ke kurir ${kurirName}`);
      setAssignModal({ isOpen: false, order: null, type: null, selectedKurirId: null });
      await loadAllData();
    } else {
      alert('Gagal assign!');
    }
  };

  const handleFocusOrder = (order) => {
    // Scroll ke order di peta (map akan handle via popup)
    // Map component sudah handle via onOrderClick
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

  // Format date for display
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('id-ID', options);

  return (
    <div className="adminkurir-dashboard">
      <button className="adminkurir-menu-toggle" id="menuToggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="adminkurir-main-content">
        <div className="adminkurir-header">
          <div className="greeting">
            <h1>Admin Kurir 🏍️</h1>
            <p>Atur pickup & delivery order ke kurir Daka Express</p>
          </div>
          <div className="right-header">
            <div className="avatar">
              <img src="https://ui-avatars.com/api/?background=F07B1A&color=fff&name=Admin+Kurir" alt="avatar" />
              <span>Admin Kurir</span>
            </div>
            <div className="date-badge">
              <i className="far fa-calendar-alt"></i> {currentDate}
            </div>
            <button className="dark-toggle" onClick={toggleDarkMode}>
              <i className="fas fa-moon"></i>
            </button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="map-order-container">
          <div className="map-wrapper">
            <OrderMap orders={todayOrders} onOrderClick={handleFocusOrder} />
          </div>
          <div className="order-list-wrapper">
            <div className="order-list-header">
              <i className="fas fa-list"></i> Daftar Order (dari Admin CS)
            </div>
            <OrderListMap orders={todayOrders} onOrderClick={handleFocusOrder} />
          </div>
        </div>

        <div className="tab-menu">
          <button
            className={`tab-btn ${activeTab === 'pickup' ? 'active' : ''}`}
            onClick={() => setActiveTab('pickup')}
          >
            📦 Pickup (Bagi ke Kurir)
          </button>
          <button
            className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            🚚 Delivery (Bagi ke Kurir)
          </button>
        </div>

        <div id="tab-pickup" className={`tab-content ${activeTab === 'pickup' ? 'active' : ''}`}>
          <div className="table-wrapper">
            <PickupTable
              orders={pickupUnassignOrders}
              kurirList={kurirList}
              onAssign={handleAssign}
            />
          </div>
        </div>

        <div id="tab-delivery" className={`tab-content ${activeTab === 'delivery' ? 'active' : ''}`}>
          <div className="table-wrapper">
            <DeliveryTable
              orders={deliveryUnassignOrders}
              kurirList={kurirList}
              onAssign={handleAssign}
            />
          </div>
        </div>

        <footer className="adminkurir-footer">
          <i className="fas fa-shipping-fast"></i> Daka Express Sameday Delivery Jogja — Admin Kurir
        </footer>
      </div>

      <AssignModal
        isOpen={assignModal.isOpen}
        order={assignModal.order}
        type={assignModal.type}
        kurirList={kurirList}
        selectedKurirId={assignModal.selectedKurirId}
        onClose={() => setAssignModal({ isOpen: false, order: null, type: null, selectedKurirId: null })}
        onConfirm={handleConfirmAssign}
      />
    </div>
  );
}