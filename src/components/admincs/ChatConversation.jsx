// apps/admin-dashboard/src/components/admincs/ChatConversation.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ChatConversation({ customer, chats, onSendMessage, onTyping, isTyping, messagesEndRef }) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    } else {
      if (onTyping) {
        onTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 1000);
      }
    }
  };

  if (!customer) return null;

  return (
    <>
      <div className="chat-conversation-header">
        <i className="fas fa-user"></i> {customer.name}
        {isTyping && <span style={{ fontSize: '0.7rem', marginLeft: '10px', color: '#f59e0b' }}>Sedang mengetik...</span>}
      </div>
      <div className="chat-messages">
        {chats.map((chat, idx) => (
          <div key={idx} className={`message ${chat.sender === 'customer' ? 'customer' : 'admin'}`}>
            <div className="message-bubble">
              <div>{chat.message}</div>
              <div className="message-time">{new Date(chat.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan..."
        />
        <button className="btn-primary" onClick={handleSend}>Kirim</button>
      </div>
    </>
  );
}