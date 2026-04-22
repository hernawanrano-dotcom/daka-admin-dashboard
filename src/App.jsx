// apps/admin-dashboard/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import SuperAdmin from './pages/SuperAdmin';
import AdminCSPanel from './pages/AdminCSPanel';
import AdminKurir from './pages/AdminKurir';
import AdminKeuangan from './pages/AdminKeuangan';

// Styles
import './styles/global.css';
import './styles/admincs.css';
import './styles/adminkurir.css';
import './styles/adminkeuangan.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route element={<Layout />}>
              <Route path="/super-admin" element={<SuperAdmin />} />
              <Route path="/super-admin/admin-cs" element={<AdminCSPanel />} />
              <Route path="/super-admin/admin-kurir" element={<AdminKurir />} />
              <Route path="/super-admin/admin-keuangan" element={<AdminKeuangan />} />
            </Route>
          </Route>

          {/* Admin CS Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admincs']} />}>
            <Route element={<Layout />}>
              <Route path="/admin-cs" element={<AdminCSPanel />} />
            </Route>
          </Route>

          {/* Admin Kurir Routes */}
          <Route element={<ProtectedRoute allowedRoles={['adminkurir']} />}>
            <Route element={<Layout />}>
              <Route path="/admin-kurir" element={<AdminKurir />} />
            </Route>
          </Route>

          {/* Admin Keuangan Routes */}
          <Route element={<ProtectedRoute allowedRoles={['adminkeuangan']} />}>
            <Route element={<Layout />}>
              <Route path="/admin-keuangan" element={<AdminKeuangan />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;