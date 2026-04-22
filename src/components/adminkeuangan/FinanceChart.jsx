// apps/admin-dashboard/src/components/adminkeuangan/FinanceChart.jsx
import React, { useEffect, useRef } from 'react';

export default function FinanceChart({ revenueByMonth, expenseByMonth }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const months = [...new Set([...Object.keys(revenueByMonth), ...Object.keys(expenseByMonth)])].sort();
    const revenues = months.map(m => revenueByMonth[m] || 0);
    const expenses = months.map(m => expenseByMonth[m] || 0);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Pendapatan',
            data: revenues,
            backgroundColor: '#0D9488',
            borderRadius: 8,
          },
          {
            label: 'Pengeluaran',
            data: expenses,
            backgroundColor: '#ef4444',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [revenueByMonth, expenseByMonth]);

  return (
    <div className="card">
      <h3><i className="fas fa-chart-line" style={{ color: '#0D9488' }}></i> Grafik Pendapatan & Pengeluaran</h3>
      <canvas ref={chartRef} height="200" style={{ width: '100%', height: '200px' }}></canvas>
    </div>
  );
}