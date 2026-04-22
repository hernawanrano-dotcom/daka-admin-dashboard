import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USERS = [
  { id: 1, email: 'admincs@daka.com', password: 'admin123', name: 'Admin CS', role: 'admin_cs' },
  { id: 2, email: 'superadmin@daka.com', password: 'admin123', name: 'Super Admin', role: 'superadmin' },
  { id: 3, email: 'adminkurir@daka.com', password: 'admin123', name: 'Admin Kurir', role: 'admin_kurir' },
  { id: 4, email: 'adminkeuangan@daka.com', password: 'admin123', name: 'Admin Keuangan', role: 'admin_keuangan' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('daka_admin_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    console.log('========== LOGIN DEBUG ==========');
    console.log('1. Email yang dimasukkan:', email);
    console.log('2. Password yang dimasukkan:', password);
    console.log('3. Panjang email:', email?.length);
    console.log('4. Panjang password:', password?.length);
    console.log('5. Daftar users di database:', USERS);
    
    const found = USERS.find(u => u.email === email && u.password === password);
    
    console.log('6. User yang ditemukan:', found);
    
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('daka_admin_user', JSON.stringify(userData));
      console.log('7. LOGIN BERHASIL! User:', userData);
      return { success: true, user: userData };
    }
    
    console.log('7. LOGIN GAGAL! User tidak ditemukan');
    return { success: false, message: 'Email atau password salah!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('daka_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}