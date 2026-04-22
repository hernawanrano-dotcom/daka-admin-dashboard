// apps/admin-dashboard/src/pages/AdminCSPanel.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { chatAPI } from '../services/api';
import io from 'socket.io-client';
import LoginForm from '../components/admincs/LoginForm';
import ChatList from '../components/admincs/ChatList';
import ChatConversation from '../components/admincs/ChatConversation';
import OrderTable from '../components/admincs/OrderTable';
import OrderModal from '../components/admincs/OrderModal';

// Socket connection
const SOCKET_URL = 'https://zippy-commitment.up.railway.app';
let socket;

export default function AdminCSPanel() {
  const { isLoggedIn, adminName, login, logout, loading: authLoading } = useAuth();
  const { orders, customers, chats, loadAllData, updateOrderStatus } = useOrders();
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [currentOrderTab, setCurrentOrderTab] = useState('today');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, order: null });
  const [loginError, setLoginError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [liveChats, setLiveChats] = useState(chats);
  const [typingCustomers, setTypingCustomers] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
      const interval = setInterval(loadAllData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, loadAllData]);

  // Socket.io connection
  useEffect(() => {
    if (isLoggedIn && !socket) {
      socket = io(SOCKET_URL);
      
      socket.emit('register', 'admin', 'admincs');
      
      socket.on('new_message', (data) => {
        setLiveChats(prev => [...prev, {
          customerId: data.customerId,
          sender: 'customer',
          message: data.message,
          timestamp: new Date().toISOString()
        }]);
        
        // Update unread count if not currently viewing this customer
        if (currentCustomerId !== data.customerId) {
          setUnreadCounts(prev => ({
            ...prev,
            [data.customerId]: (prev[data.customerId] || 0) + 1
          }));
        }
      });
      
      socket.on('user_typing', (data) => {
        setTypingCustomers(prev => ({
          ...prev,
          [data.customerId]: data.isTyping
        }));
        setTimeout(() => {
          setTypingCustomers(prev => ({
            ...prev,
            [data.customerId]: false
          }));
        }, 1000);
      });
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isLoggedIn, currentCustomerId]);

  useEffect(() => {
    setLiveChats(chats);
  }, [chats]);

  useEffect(() => {
    const counts = {};
    liveChats.forEach(chat => {
      if (chat.sender === 'customer' && !chat.read) {
        if (currentCustomerId !== chat.customerId) {
          counts[chat.customerId] = (counts[chat.customerId] || 0) + 1;
        }
      }
    });
    setUnreadCounts(counts);
  }, [liveChats, currentCustomerId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveChats, currentCustomerId]);

  const handleLogin = (email, password) => {
    const success = login(email, password);
    if (!success) setLoginError('Login gagal!');
    else setLoginError('');
  };

  const handleLogout = () => {
    logout();
    setCurrentCustomerId(null);
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const handleSelectChat = useCallback(async (customerId) => {
    setCurrentCustomerId(customerId);
    
    // Mark unread messages as read
    const unreadChats = liveChats.filter(c => c.customerId === customerId && c.sender === 'customer' && !c.read);
    for (const chat of unreadChats) {
      await chatAPI.markRead(chat.id);
    }
    
    // Clear unread count for this customer
    setUnreadCounts(prev => ({
      ...prev,
      [customerId]: 0
    }));
    
    await loadAllData();
  }, [liveChats, loadAllData]);

  const handleSendMessage = async (message) => {
    if (!message || !currentCustomerId) return;
    await chatAPI.sendAdmin({ customerId: currentCustomerId, message });
    
    if (socket) {
      socket.emit('send_message', {
        customerId: currentCustomerId,
        message,
        sender: 'admincs'
      });
    }
    
    await loadAllData();
  };

  const handleTyping = (isTyping) => {
    if (socket && currentCustomerId) {
      socket.emit('typing', {
        customerId: currentCustomerId,
        isTyping,
        sender: 'admincs'
      });
    }
  };

  const getCurrentCustomer = () => {
    return customers.find(c => c.id === currentCustomerId);
  };

  const getCurrentCustomerChats = () => {
    return liveChats.filter(c => c.customerId === currentCustomerId);
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
  const currentCustomer = getCurrentCustomer();
  const currentChats = getCurrentCustomerChats();
  const isCustomerTyping = currentCustomerId ? typingCustomers[currentCustomerId] : false;

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
            chats={liveChats}
            customers={customers}
            currentCustomerId={currentCustomerId}
            onSelectChat={handleSelectChat}
            unreadCounts={unreadCounts}
            typingCustomers={typingCustomers}
          />
        </div>

        {/* KANAN */}
        <div className="right-panel">
          {/* KOTAK OBROLAN */}
          {currentCustomerId ? (
            <div className="chat-conversation-area" style={{ display: 'flex', flexDirection: 'column', height: '50%' }}>
              <ChatConversation
                customer={currentCustomer}
                chats={currentChats}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                isTyping={isCustomerTyping}
                messagesEndRef={messagesEndRef}
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