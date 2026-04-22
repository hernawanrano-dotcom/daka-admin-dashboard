// apps/admin-dashboard/src/services/api.js
const API_BASE = 'http://localhost:5000/api';

export async function fetchAPI(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await res.json();
  } catch (e) {
    console.error('API Error:', e);
    return { success: false, message: e.message };
  }
}

export const orderAPI = {
  getAll: () => fetchAPI('/customer/orders/all'),
  updateStatus: (data) => fetchAPI('/order/status', { method: 'PUT', body: JSON.stringify(data) }),
};

export const chatAPI = {
  getAll: () => fetchAPI('/customer/chats/all'),
  markRead: (chatId) => fetchAPI('/chat/mark-read', { method: 'POST', body: JSON.stringify({ chatId }) }),
  sendAdmin: (data) => fetchAPI('/admin/chat/send', { method: 'POST', body: JSON.stringify(data) }),
};

export const customerAPI = {
  getAll: () => fetchAPI('/customers/all'),
};

export const staffAPI = {
  getAll: () => fetchAPI('/staff/all'),
};