// apps/admin-dashboard/src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderAPI, customerAPI, chatAPI } from '../services/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      const [ordersRes, customersRes, chatsRes] = await Promise.all([
        orderAPI.getAll(),
        customerAPI.getAll(),
        chatAPI.getAll(),
      ]);

      if (ordersRes?.success) setOrders(ordersRes.orders);
      if (customersRes?.success) setCustomers(customersRes.customers);
      if (chatsRes?.success) setChats(chatsRes.chats);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    const res = await orderAPI.updateStatus({ orderId, status, ...additionalData });
    if (res?.success) await loadAllData();
    return res?.success;
  };

  return { orders, customers, chats, loading, loadAllData, updateOrderStatus };
}