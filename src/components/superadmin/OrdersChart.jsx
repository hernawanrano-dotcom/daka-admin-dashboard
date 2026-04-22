// apps/admin-dashboard/src/components/superadmin/OrdersChart.jsx
import React, { useEffect, useRef } from 'react';

export default function OrdersChart({ orders, getOrdersByDate }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const { dates, orderCounts } = getOrdersByDate(orders);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Jumlah Order',
          data: orderCounts,
          backgroundColor: '#F59E0B',
          borderRadius: 8,
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
  }, [orders, getOrdersByDate]);

  return (
    <div className="card">
      <h3><i className="fas fa-chart-bar" style={{ color: '#F59E0B' }}></i> Order</h3>
      <canvas ref={chartRef} height="200" style={{ width: '100%', height: '200px' }}></canvas>
    </div>
  );
}