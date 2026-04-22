// apps/admin-dashboard/src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const ADMIN_CS_ACCOUNT = {
  email: 'admincs@daka.com',
  password: '123456',
  name: 'Admin CS',
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('admin_cs_logged');
    if (saved === 'true') {
      setIsLoggedIn(true);
      setAdminName(ADMIN_CS_ACCOUNT.name);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === ADMIN_CS_ACCOUNT.email && password === ADMIN_CS_ACCOUNT.password) {
      setIsLoggedIn(true);
      setAdminName(ADMIN_CS_ACCOUNT.name);
      localStorage.setItem('admin_cs_logged', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_cs_logged');
  };

  return { isLoggedIn, adminName, login, logout, loading };
}