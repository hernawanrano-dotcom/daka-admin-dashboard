// apps/admin-dashboard/src/components/superadmin/RevenueChart.jsx
import React, { useEffect, useRef } from 'react';

export default function RevenueChart({ orders, getRevenueByDate }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const { dates, revenues } = getRevenueByDate(orders);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Pendapatan (Rp)',
          data: revenues,
          borderColor: '#0D9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.3,
        }],
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
  }, [orders, getRevenueByDate]);

  return (
    <div className="card">
      <h3><i className="fas fa-chart-line" style={{ color: '#0D9488' }}></i> Pendapatan (Rp)</h3>
      <canvas ref={chartRef} height="200" style={{ width: '100%', height: '200px' }}></canvas>
    </div>
  );
}