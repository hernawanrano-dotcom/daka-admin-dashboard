import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    console.log('Form submitted with:', { cleanEmail, cleanPassword });
    
    const result = await login(cleanEmail, cleanPassword);
    
    if (result.success) {
      window.location.href = '/admin-cs';
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const demoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Optional: langsung submit
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0f2a' }}>
      <div style={{ background: '#1a2040', padding: 40, borderRadius: 20, width: 400 }}>
        <h1 style={{ color: '#0088ff', textAlign: 'center' }}>DAKA Express</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: 'none' }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: 'none' }} 
          />
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#0088ff', border: 'none', borderRadius: 8, color: 'white', marginTop: 10 }}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: 20 }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa' }}>Demo Login Cepat:</p>
          <button onClick={() => demoLogin('admincs@daka.com', 'admin123')} style={{ width: '100%', padding: 8, margin: '5px 0', background: '#0088ff', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer' }}>Admin CS</button>
          <button onClick={() => demoLogin('superadmin@daka.com', 'admin123')} style={{ width: '100%', padding: 8, margin: '5px 0', background: '#0088ff', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer' }}>Super Admin</button>
          <button onClick={() => demoLogin('adminkurir@daka.com', 'admin123')} style={{ width: '100%', padding: 8, margin: '5px 0', background: '#0088ff', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer' }}>Admin Kurir</button>
        </div>
      </div>
    </div>
  );
}