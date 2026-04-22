// apps/admin-dashboard/src/hooks/useKeuangan.js
import { useState, useEffect, useCallback } from 'react';

const ESTIMATED_PRICE = 25000;

export function useKeuangan(orders) {
  const [rekening, setRekening] = useState([]);
  const [pengeluaran, setPengeluaran] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLocalData = useCallback(() => {
    const savedRekening = localStorage.getItem('daka_rekening');
    const savedPengeluaran = localStorage.getItem('daka_pengeluaran');
    
    setRekening(savedRekening ? JSON.parse(savedRekening) : []);
    setPengeluaran(savedPengeluaran ? JSON.parse(savedPengeluaran) : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  const saveRekening = (data) => {
    localStorage.setItem('daka_rekening', JSON.stringify(data));
    setRekening(data);
  };

  const savePengeluaran = (data) => {
    localStorage.setItem('daka_pengeluaran', JSON.stringify(data));
    setPengeluaran(data);
  };

  const addRekening = (bank, number, name, saldo) => {
    const newRekening = [...rekening, { id: Date.now(), bank, number, name, saldo: parseInt(saldo) || 0 }];
    saveRekening(newRekening);
    return newRekening;
  };

  const deleteRekening = (id) => {
    const newRekening = rekening.filter(r => r.id !== id);
    saveRekening(newRekening);
  };

  const addPengeluaran = (date, category, desc, amount) => {
    const newPengeluaran = [...pengeluaran, { id: Date.now(), date, category, desc, amount: parseInt(amount) }];
    savePengeluaran(newPengeluaran);
    return newPengeluaran;
  };

  const deletePengeluaran = (id) => {
    const newPengeluaran = pengeluaran.filter(p => p.id !== id);
    savePengeluaran(newPengeluaran);
  };

  const getTotalRevenue = () => {
    return orders.filter(o => o.status === 'delivered' || o.status === 'selesai').length * ESTIMATED_PRICE;
  };

  const getTotalPengeluaran = () => {
    return pengeluaran.reduce((sum, p) => sum + p.amount, 0);
  };

  const getNetProfit = () => {
    return getTotalRevenue() - getTotalPengeluaran();
  };

  const getUnpaidAmount = () => {
    return orders.filter(o => o.status !== 'delivered' && o.status !== 'selesai' && o.status !== 'dibatalkan').length * ESTIMATED_PRICE;
  };

  const getRevenueByMonth = () => {
    const revenueByMonth = {};
    orders.forEach(o => {
      if (o.status === 'delivered' || o.status === 'selesai') {
        const month = o.tglOrder?.substring(0, 7);
        if (month) revenueByMonth[month] = (revenueByMonth[month] || 0) + ESTIMATED_PRICE;
      }
    });
    return revenueByMonth;
  };

  const getExpenseByMonth = () => {
    const expenseByMonth = {};
    pengeluaran.forEach(p => {
      const month = p.date?.substring(0, 7);
      if (month) expenseByMonth[month] = (expenseByMonth[month] || 0) + p.amount;
    });
    return expenseByMonth;
  };

  return {
    rekening,
    pengeluaran,
    loading,
    addRekening,
    deleteRekening,
    addPengeluaran,
    deletePengeluaran,
    getTotalRevenue,
    getTotalPengeluaran,
    getNetProfit,
    getUnpaidAmount,
    getRevenueByMonth,
    getExpenseByMonth,
  };
}