// apps/admin-dashboard/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Data user untuk demo
const USERS = [
  {
    id: 1,
    email: 'superadmin@daka.com',
    password: 'super123',
    name: 'Super Admin',
    role: 'superadmin',
    roleName: 'Super Admin',
  },
  {
    id: 2,
    email: 'admincs@daka.com',
    password: 'cs123',
    name: 'Admin CS',
    role: 'admincs',
    roleName: 'Admin CS',
  },
  {
    id: 3,
    email: 'adminkurir@daka.com',
    password: 'kurir123',
    name: 'Admin Kurir',
    role: 'adminkurir',
    roleName: 'Admin Kurir',
  },
  {
    id: 4,
    email: 'adminkeuangan@daka.com',
    password: 'uang123',
    name: 'Admin Keuangan',
    role: 'adminkeuangan',
    roleName: 'Admin Keuangan',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('daka_admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('daka_admin_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Email atau password salah!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('daka_admin_user');
  };

  const hasAccess = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}