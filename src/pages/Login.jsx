// apps/admin-dashboard/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);
    
    if (result.success) {
      // Redirect berdasarkan role
      if (result.user.role === 'superadmin') navigate('/super-admin');
      else if (result.user.role === 'admincs') navigate('/admin-cs');
      else if (result.user.role === 'adminkurir') navigate('/admin-kurir');
      else if (result.user.role === 'adminkeuangan') navigate('/admin-keuangan');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'superadmin@daka.com', password: 'super123', role: 'Super Admin' },
    { email: 'admincs@daka.com', password: 'cs123', role: 'Admin CS' },
    { email: 'adminkurir@daka.com', password: 'kurir123', role: 'Admin Kurir' },
    { email: 'adminkeuangan@daka.com', password: 'uang123', role: 'Admin Keuangan' },
  ];

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '450px' }}>
        <div className="logo">
          <h1>DAKA <span>Express</span></h1>
          <p>Admin Portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '24px' }}>
          <p style={{ textAlign: 'center', marginBottom: '12px', fontSize: '0.8rem', color: '#64748b' }}>
            Demo Akun (klik untuk login cepat):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => fillDemo(acc.email, acc.password)}
                style={{
                  padding: '8px 12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                }}
              >
                <strong>{acc.role}</strong><br />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}