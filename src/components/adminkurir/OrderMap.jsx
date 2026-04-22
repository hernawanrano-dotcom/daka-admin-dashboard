// apps/admin-dashboard/src/components/adminkurir/OrderMap.jsx
import React, { useEffect, useRef } from 'react';

// Leaflet will be loaded from CDN in index.html
const L = window.L;

export default function OrderMap({ orders, onOrderClick }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!L) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('adminKurirMap').setView([-7.7956, 110.3695], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !L || !orders.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const pickupIcon = L.divIcon({
      html: '<div style="background:#F07B1A; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-hand-holding" style="color:white; font-size:14px;"></i></div>',
      iconSize: [32, 32],
    });

    const deliveryIcon = L.divIcon({
      html: '<div style="background:#065493; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-flag-checkered" style="color:white; font-size:14px;"></i></div>',
      iconSize: [32, 32],
    });

    const bounds = [];

    orders.forEach(order => {
      // Pickup marker
      if (order.pengirimAlamat?.lat && order.pengirimAlamat?.lng) {
        const marker = L.marker([order.pengirimAlamat.lat, order.pengirimAlamat.lng], { icon: pickupIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <b>📦 PICKUP</b><br>
            <b>${order.noResi}</b><br>
            Pengirim: ${order.pengirim}<br>
            Alamat: ${order.pengirimAlamat.full || '-'}<br>
            ShareLoc: <a href="${order.pengirimAlamat.shareloc}" target="_blank">Buka Maps</a><br>
            ${order.assignedPickupKurirName ? `<span style="color:#10b981;">✓ Kurir: ${order.assignedPickupKurirName}</span>` : '<span style="color:#F07B1A;">⚠️ Belum assign kurir</span>'}
          `);
        marker.on('click', () => onOrderClick(order));
        markersRef.current.push(marker);
        bounds.push([order.pengirimAlamat.lat, order.pengirimAlamat.lng]);
      }

      // Delivery marker
      if (order.penerimaAlamat?.lat && order.penerimaAlamat?.lng) {
        const marker = L.marker([order.penerimaAlamat.lat, order.penerimaAlamat.lng], { icon: deliveryIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <b>🚚 DELIVERY</b><br>
            <b>${order.noResi}</b><br>
            Penerima: ${order.penerima}<br>
            Alamat: ${order.penerimaAlamat.full || '-'}<br>
            ShareLoc: <a href="${order.penerimaAlamat.shareloc}" target="_blank">Buka Maps</a><br>
            ${order.assignedDeliveryKurirName ? `<span style="color:#10b981;">✓ Kurir: ${order.assignedDeliveryKurirName}</span>` : '<span style="color:#065493;">⚠️ Belum assign kurir</span>'}
          `);
        marker.on('click', () => onOrderClick(order));
        markersRef.current.push(marker);
        bounds.push([order.penerimaAlamat.lat, order.penerimaAlamat.lng]);
      }
    });

    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [orders, onOrderClick]);

  return <div id="adminKurirMap" style={{ height: '450px', borderRadius: '20px', border: '1px solid #edf2f7', zIndex: 1 }}></div>;
}