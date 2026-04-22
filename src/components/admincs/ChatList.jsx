// apps/admin-dashboard/src/components/admincs/ChatList.jsx
import React from 'react';

export default function ChatList({ chats, customers, currentCustomerId, onSelectChat, unreadCounts }) {
  const customerIds = [...new Set(chats.map(c => c.customerId))];

  if (customerIds.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Belum ada chat</div>;
  }

  return (
    <div className="chat-list-items">
      {customerIds.map(custId => {
        const customer = customers.find(c => c.id === custId);
        const customerChats = chats.filter(c => c.customerId === custId);
        const lastChat = customerChats[customerChats.length - 1];
        const unreadCount = unreadCounts[custId] || 0;

        return (
          <div
            key={custId}
            className={`chat-item ${currentCustomerId === custId ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => onSelectChat(custId)}
          >
            <div className="chat-item-info">
              <div className="chat-item-name">{customer?.name || 'Customer'}</div>
              <div className="chat-item-lastmsg">{lastChat?.message?.substring(0, 40) || '-'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="chat-item-time">
                {lastChat ? new Date(lastChat.timestamp).toLocaleTimeString() : '-'}
              </div>
              {unreadCount > 0 && <div className="unread-badge">{unreadCount}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}