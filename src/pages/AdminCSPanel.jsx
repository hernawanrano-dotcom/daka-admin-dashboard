// apps/admin-dashboard/src/pages/AdminCSPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { chatAPI } from '../services/api';
import LoginForm from '../components/admincs/LoginForm';
import ChatList from '../components/admincs/ChatList';
import ChatConversation from '../components/admincs/ChatConversation';
import OrderTable from '../components/admincs/OrderTable';
import OrderModal from '../components/admincs/OrderModal';

export default function AdminCSPanel() {
  const { isLoggedIn, adminName, login, logout, loading: authLoading } = useAuth();
  const { orders, customers, chats, loadAllData, updateOrderStatus } = useOrders();
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [currentOrderTab, setCurrentOrderTab] = useState('today');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, order: null });
  const [loginError, setLoginError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
      const interval = setInterval(loadAllData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, loadAllData]);

  useEffect(() => {
    const counts = {};
    chats.forEach(chat => {
      if (chat.sender === 'customer' && !chat.read) {
        counts[chat.customerId] = (counts[chat.customerId] || 0) + 1;
      }
    });
    setUnreadCounts(counts);
  }, [chats]);

  const handleLogin = (email, password) => {
    const success = login(email, password);
    if (!success) setLoginError('Login gagal!');
    else setLoginError('');
  };

  const handleLogout = () => {
    logout();
    setCurrentCustomerId(null);
  };

  const handleSelectChat = useCallback(async (customerId) => {
    setCurrentCustomerId(customerId);

    const unreadChats = chats.filter(c => c.customerId === customerId && c.sender === 'customer' && !c.read);
    for (const chat of unreadChats) {
      await chatAPI.markRead(chat.id);
    }
    await loadAllData();
  }, [chats, loadAllData]);

  const handleSendMessage = async (message) => {
    if (!message || !currentCustomerId) return;
    await chatAPI.sendAdmin({ customerId: currentCustomerId, message });
    await loadAllData();
  };

  const getCurrentCustomer = () => {
    return customers.find(c => c.id === currentCustomerId);
  };

  const getCurrentCustomerChats = () => {
    return chats.filter(c => c.customerId === currentCustomerId);
  };

  const getFilteredOrders = () => {
    const today = new Date().toISOString().split('T')[0];

    if (currentOrderTab === 'today') {
      return orders.filter(o => o.scheduleDate === today && o.status !== 'dibatalkan');
    }
    if (currentOrderTab === 'date') {
      return orders.filter(o => o.scheduleDate === customDate && o.status !== 'dibatalkan');
    }
    if (currentOrderTab === 'cancel') {
      return orders.filter(o => o.status === 'dibatalkan');
    }
    return [];
  };

  const handleSchedule = (order) => {
    setModalState({ isOpen: true, type: 'schedule', order });
  };

  const handleReschedule = (order) => {
    setModalState({ isOpen: true, type: 'reschedule', order });
  };

  const handleCancel = (order) => {
    setModalState({ isOpen: true, type: 'cancel', order });
  };

  const handleModalConfirm = async (data) => {
    const { order, type } = modalState;

    if (type === 'schedule') {
      await updateOrderStatus(order.id, 'dijadwalkan', {
        scheduleDate: data.scheduleDate,
        scheduleDay: data.scheduleDay,
        note: '📅 Order dijadwalkan oleh Admin CS',
      });
    } else if (type === 'reschedule') {
      await updateOrderStatus(order.id, 'dijadwalkan', {
        scheduleDate: data.scheduleDate,
        scheduleDay: data.scheduleDay,
        note: '🔄 Jadwal diubah oleh Admin CS',
      });
    } else if (type === 'cancel') {
      await updateOrderStatus(order.id, 'dibatalkan', {
        cancelReason: data.cancelReason,
        cancelBy: 'admin_cs',
      });
    }

    setModalState({ isOpen: false, type: null, order: null });
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  if (authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="admin-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* HEADER */}
      <div className="header">
        <div className="logo"><h2>DAKA <span>Express</span></h2></div>
        <div className="admin-info">
          <div className="avatar">{adminName.charAt(0)}</div>
          <span>{adminName}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="dark-toggle" onClick={toggleDarkMode}><i className="fas fa-moon"></i></button>
        </div>
      </div>

      {/* NAVIGASI TABS */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${currentOrderTab === 'today' ? 'active' : ''}`}
          onClick={() => setCurrentOrderTab('today')}
        >📅 Order Hari Ini</button>
        <button
          className={`nav-tab ${currentOrderTab === 'date' ? 'active' : ''}`}
          onClick={() => setCurrentOrderTab('date')}
        >📆 Order Berdasarkan Tanggal</button>
        <button
          className={`nav-tab ${currentOrderTab === 'cancel' ? 'active' : ''}`}
          onClick={() => setCurrentOrderTab('cancel')}
        >❌ Order Cancel</button>
      </div>

      {/* DUA KOLOM */}
      <div className="two-columns">
        {/* KIRI: DAFTAR CHAT */}
        <div className="chat-list">
          <div className="chat-list-header"><i className="fas fa-comments"></i> Chat</div>
          <ChatList
            chats={chats}
            customers={customers}
            currentCustomerId={currentCustomerId}
            onSelectChat={handleSelectChat}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* KANAN */}
        <div className="right-panel">
          {/* KOTAK OBROLAN */}
          {currentCustomerId ? (
            <div className="chat-conversation-area" style={{ display: 'flex', flexDirection: 'column', height: '50%' }}>
              <ChatConversation
                customer={getCurrentCustomer()}
                chats={getCurrentCustomerChats()}
                onSendMessage={handleSendMessage}
              />
            </div>
          ) : (
            <div id="noChatSelected" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <i className="fas fa-comments" style={{ fontSize: '48px', marginRight: '16px' }}></i>
              Pilih chat dari daftar kiri
            </div>
          )}

          {/* AREA ORDER */}
          <div className="order-area">
            <div className="order-header">
              <div>
                <strong>
                  {currentOrderTab === 'today' && 'Order Hari Ini'}
                  {currentOrderTab === 'date' && 'Order Berdasarkan Tanggal'}
                  {currentOrderTab === 'cancel' && 'Order Cancel'}
                </strong>
              </div>
              {currentOrderTab === 'date' && (
                <div className="date-filter">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                </div>
              )}
            </div>
            <OrderTable
              orders={filteredOrders}
              onSchedule={handleSchedule}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <OrderModal
        isOpen={modalState.isOpen}
        title={
          modalState.type === 'schedule' ? 'Jadwalkan Order' :
          modalState.type === 'reschedule' ? 'Jadwalkan Ulang' :
          modalState.type === 'cancel' ? 'Batalkan Order' : ''
        }
        type={modalState.type}
        order={modalState.order}
        onClose={() => setModalState({ isOpen: false, type: null, order: null })}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}