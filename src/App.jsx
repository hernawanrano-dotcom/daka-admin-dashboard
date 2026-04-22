import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminCSLayout from './layouts/AdminCSLayout';
import AdminKurirLayout from './layouts/AdminKurirLayout';
import AdminKeuanganLayout from './layouts/AdminKeuanganLayout';

// Pages
import Login from './pages/Login';
import SuperAdmin from './pages/SuperAdmin';
import AdminCSPanel from './pages/AdminCSPanel';
import AdminKurir from './pages/AdminKurir';
import AdminKeuangan from './pages/AdminKeuangan';

// Import global styles
import './styles/global.css';
import './styles/superadmin.css';
import './styles/admincs.css';
import './styles/adminkurir.css';
import './styles/adminkeuangan.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<SuperAdmin />} />
              <Route path="admin-cs" element={<AdminCSPanel />} />
              <Route path="admin-kurir" element={<AdminKurir />} />
              <Route path="admin-keuangan" element={<AdminKeuangan />} />
            </Route>
          </Route>

          {/* Admin CS Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admincs']} />}>
            <Route path="/admin-cs" element={<AdminCSLayout />}>
              <Route index element={<AdminCSPanel />} />
            </Route>
          </Route>

          {/* Admin Kurir Routes */}
          <Route element={<ProtectedRoute allowedRoles={['adminkurir']} />}>
            <Route path="/admin-kurir" element={<AdminKurirLayout />}>
              <Route index element={<AdminKurir />} />
            </Route>
          </Route>

          {/* Admin Keuangan Routes */}
          <Route element={<ProtectedRoute allowedRoles={['adminkeuangan']} />}>
            <Route path="/admin-keuangan" element={<AdminKeuanganLayout />}>
              <Route index element={<AdminKeuangan />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;