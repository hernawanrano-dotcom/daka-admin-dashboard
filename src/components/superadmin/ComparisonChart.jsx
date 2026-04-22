// apps/admin-dashboard/src/components/superadmin/ComparisonChart.jsx
import React, { useEffect, useRef } from 'react';

export default function ComparisonChart({ thisMonth, lastMonth }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Bulan Lalu', 'Bulan Ini'],
        datasets: [{
          label: 'Pendapatan (Rp)',
          data: [lastMonth, thisMonth],
          backgroundColor: ['#94a3b8', '#0D9488'],
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
  }, [thisMonth, lastMonth]);

  return (
    <div className="card">
      <h3><i className="fas fa-chart-line" style={{ color: '#F59E0B' }}></i> Perbandingan Pendapatan</h3>
      <canvas ref={chartRef} height="200" style={{ width: '100%', height: '200px' }}></canvas>
    </div>
  );
}