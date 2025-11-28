import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Stock from './pages/Stock';
import InventoryLogs from './pages/InventoryLogs';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePharmacy();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePharmacy();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const THEME_COLORS: Record<string, { primary: string; hover: string; light: string; border: string; text: string }> = {
  amber: { primary: '#fbbf24', hover: '#f59e0b', light: '#fffbeb', border: '#fef3c7', text: '#b45309' },
  teal: { primary: '#2dd4bf', hover: '#14b8a6', light: '#f0fdfa', border: '#ccfbf1', text: '#0f766e' },
  blue: { primary: '#60a5fa', hover: '#3b82f6', light: '#eff6ff', border: '#dbeafe', text: '#1d4ed8' },
  rose: { primary: '#fb7185', hover: '#f43f5e', light: '#fff1f2', border: '#ffe4e6', text: '#be123c' },
  emerald: { primary: '#34d399', hover: '#10b981', light: '#ecfdf5', border: '#d1fae5', text: '#047857' },
};

const AppContent: React.FC = () => {
  const { fontFamily, themeColor } = usePharmacy();
  
  const theme = THEME_COLORS[themeColor] || THEME_COLORS.amber;

  // Apply theme variables globally to document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-hover', theme.hover);
    root.style.setProperty('--color-light', theme.light);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-text', theme.text);
  }, [theme]);
  
  return (
    <div className={fontFamily}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pos" element={<POS />} />
            <Route path="stock" element={<Stock />} />
            <Route path="inventory-logs" element={<InventoryLogs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="account" element={<Account />} />
            
            {/* Admin Only Routes */}
            <Route path="audit" element={
              <AdminRoute>
                <AuditLogs />
              </AdminRoute>
            } />
            <Route path="settings" element={
              <AdminRoute>
                <Settings />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PharmacyProvider>
      <AppContent />
    </PharmacyProvider>
  );
};

export default App;