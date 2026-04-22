// apps/admin-dashboard/src/components/admincs/LoginForm.jsx
import React, { useState } from 'react';

export default function LoginForm({ onLogin, error }) {
  const [email, setEmail] = useState('admincs@daka.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>DAKA <span>Express</span></h1>
          <p>Admin CS Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admincs@daka.com"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Demo: admincs@daka.com / 123456</p>
      </div>
    </div>
  );
}