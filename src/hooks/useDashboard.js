// apps/admin-dashboard/src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';

const ESTIMATED_PRICE_PER_ORDER = 25000;

export function useDashboard(orders, customers, staff) {
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDateRange = useCallback((periodType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start, end = new Date(today);

    if (periodType === 'day') {
      start = new Date(today);
      end = new Date(today);
    } else if (periodType === 'week') {
      const day = now.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
      end = new Date(today);
    } else if (periodType === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }
    return { start, end };
  }, []);

  const filterOrdersByDate = useCallback((ordersList, start, end) => {
    if (!start && !end) return ordersList;
    return ordersList.filter(o => {
      const d = new Date(o.tglOrder);
      if (start && d < new Date(start)) return false;
      if (end && d > new Date(end)) return false;
      return true;
    });
  }, []);

  const getFilteredOrders = useCallback(() => {
    let filtered = [...orders];
    if (startDate && endDate) {
      filtered = filterOrdersByDate(orders, startDate, endDate);
    } else {
      const { start, end } = getDateRange(period);
      filtered = filterOrdersByDate(orders, start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    }
    return filtered;
  }, [orders, period, startDate, endDate, getDateRange, filterOrdersByDate]);

  const calculateStats = useCallback((ordersList) => {
    const totalOrders = ordersList.length;
    const pending = ordersList.filter(o => o.status === 'pending').length;
    const scheduled = ordersList.filter(o => o.status === 'scheduled' || o.status === 'dijadwalkan').length;
    const picked = ordersList.filter(o => o.status === 'picked' || o.status === 'proses_pickup').length;
    const delivered = ordersList.filter(o => o.status === 'delivered' || o.status === 'selesai').length;
    const totalRevenue = totalOrders * ESTIMATED_PRICE_PER_ORDER;
    const onTimeRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;
    const uniqueCustomers = [...new Set(ordersList.map(o => o.customerId))].length;
    return { totalOrders, pending, scheduled, picked, delivered, totalRevenue, onTimeRate, uniqueCustomers };
  }, []);

  const getRevenueByDate = useCallback((ordersList) => {
    const revenueByDate = {};
    ordersList.forEach(o => {
      revenueByDate[o.tglOrder] = (revenueByDate[o.tglOrder] || 0) + ESTIMATED_PRICE_PER_ORDER;
    });
    const dates = Object.keys(revenueByDate).sort();
    const revenues = dates.map(d => revenueByDate[d]);
    return { dates, revenues };
  }, []);

  const getOrdersByDate = useCallback((ordersList) => {
    const ordersByDate = {};
    ordersList.forEach(o => {
      ordersByDate[o.tglOrder] = (ordersByDate[o.tglOrder] || 0) + 1;
    });
    const dates = Object.keys(ordersByDate).sort();
    const orderCounts = dates.map(d => ordersByDate[d]);
    return { dates, orderCounts };
  }, []);

  const getTopCustomers = useCallback((ordersList) => {
    const count = {};
    ordersList.forEach(o => {
      count[o.customerId] = (count[o.customerId] || 0) + 1;
    });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, c]) => ({
        customerId: parseInt(id),
        totalOrders: c,
        totalSpent: c * ESTIMATED_PRICE_PER_ORDER,
      }));
  }, []);

  const getTopKurir = useCallback(() => {
    const kurirList = staff.filter(s => s.role === 'kurir' && s.status === 'active');
    return kurirList.slice(0, 10).map(k => ({
      ...k,
      totalKirim: Math.floor(Math.random() * 50),
      rating: (3 + Math.random() * 2).toFixed(1),
    })).sort((a, b) => b.totalKirim - a.totalKirim);
  }, [staff]);

  const getComparisonData = useCallback(() => {
    const now = new Date();
    const thisMonthOrders = orders.filter(o => {
      const d = new Date(o.tglOrder);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length * ESTIMATED_PRICE_PER_ORDER;
    const lastMonthOrders = orders.filter(o => {
      const d = new Date(o.tglOrder);
      return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
    }).length * ESTIMATED_PRICE_PER_ORDER;
    return { thisMonth: thisMonthOrders, lastMonth: lastMonthOrders };
  }, [orders]);

  const getMetrics = useCallback((ordersList, stats) => {
    const avgOrderPerDay = ordersList.length > 0 ? (ordersList.length / 30).toFixed(1) : 0;
    const avgRevenuePerOrder = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
    const now = new Date();
    const thisMonthOrders = ordersList.filter(o => {
      const d = new Date(o.tglOrder);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const lastMonthOrders = ordersList.filter(o => {
      const d = new Date(o.tglOrder);
      return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
    }).length;
    const growth = lastMonthOrders > 0 ? (((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1) : 0;
    return { avgOrderPerDay, avgRevenuePerOrder, growth, totalCustomers: customers.length, totalKurir: staff.filter(s => s.role === 'kurir').length };
  }, [customers, staff]);

  const setCustomDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setPeriod('custom');
  };

  const setPeriodFilter = (newPeriod) => {
    setPeriod(newPeriod);
    setStartDate(null);
    setEndDate(null);
  };

  return {
    period,
    startDate,
    endDate,
    filteredOrders: getFilteredOrders(),
    stats: calculateStats(getFilteredOrders()),
    getRevenueByDate,
    getOrdersByDate,
    getTopCustomers,
    getTopKurir,
    getComparisonData,
    getMetrics,
    setPeriodFilter,
    setCustomDate,
  };
}