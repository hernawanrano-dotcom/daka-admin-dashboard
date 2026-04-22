// apps/admin-dashboard/src/hooks/useStaff.js
import { useState, useEffect, useCallback } from 'react';
import { staffAPI } from '../services/api';

export function useStaff() {
  const [staff, setStaff] = useState([]);
  const [kurirList, setKurirList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStaff = useCallback(async () => {
    try {
      const res = await staffAPI.getAll();
      if (res?.success) {
        setStaff(res.staff || []);
        const kurirs = (res.staff || []).filter(s => s.role === 'kurir' && s.status === 'active');
        setKurirList(kurirs);
      }
    } catch (error) {
      console.error('Load staff error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  return { staff, kurirList, loading, loadStaff };
}