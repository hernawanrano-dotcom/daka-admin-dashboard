// apps/admin-dashboard/src/components/superadmin/MetricsTable.jsx
import React from 'react';

export default function MetricsTable({ metrics }) {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const metricsList = [
    { label: 'Rata-rata Order per Hari', value: `${metrics.avgOrderPerDay} order/hari` },
    { label: 'Rata-rata Pendapatan per Order', value: `Rp ${formatRupiah(metrics.avgRevenuePerOrder)}` },
    { 
      label: 'Growth Order (Bulan ini vs Bulan lalu)', 
      value: `${metrics.growth >= 0 ? '+' : ''}${metrics.growth}%`,
      className: metrics.growth >= 0 ? 'growth-positive' : 'growth-negative',
    },
    { label: 'Total Customer Terdaftar', value: metrics.totalCustomers },
    { label: 'Total Kurir Aktif', value: metrics.totalKurir },
  ];

  return (
    <div className="table-wrapper">
      <table style={{ width: '100%' }}>
        <tbody>
          {metricsList.map((metric, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{metric.label}</td>
              <td className={metric.className || ''}>{metric.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}