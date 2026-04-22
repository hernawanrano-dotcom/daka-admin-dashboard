// apps/admin-dashboard/src/components/superadmin/StatusChart.jsx
import React, { useEffect, useRef } from 'react';

export default function StatusChart({ stats }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Terjadwal', 'Diambil Kurir', 'Selesai'],
        datasets: [{
          data: [stats.pending, stats.scheduled, stats.picked, stats.delivered],
          backgroundColor: ['#d97706', '#059669', '#c2410c', '#2563eb'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="card">
      <h3><i className="fas fa-chart-pie" style={{ color: '#0D9488' }}></i> Status Order</h3>
      <canvas ref={chartRef} height="200" style={{ width: '100%', height: '200px' }}></canvas>
    </div>
  );
}