// apps/admin-dashboard/src/components/admincs/ChatConversation.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ChatConversation({ customer, chats, onSendMessage }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!customer) return null;

  return (
    <>
      <div className="chat-conversation-header">
        <i className="fas fa-user"></i> {customer.name}
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