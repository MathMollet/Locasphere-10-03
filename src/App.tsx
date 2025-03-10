import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import FAQ from './pages/FAQ';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import PropertiesList from './pages/PropertiesList';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Properties from './pages/Properties';
import Applications from './pages/Applications';
import Chat from './pages/Chat';
import Tenants from './pages/Tenants';
import Incidents from './pages/Incidents';
import Resources from './pages/Resources';
import Accounting from './pages/Accounting';
import PropertySearch from './pages/PropertySearch';
import TenantFile from './pages/TenantFile';
import TenantApplications from './pages/TenantApplications';
import TenantProperty from './pages/TenantProperty';
import TenantIncidents from './pages/TenantIncidents';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DbAdmin from './pages/DbAdmin';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/properties-list" element={<PropertiesList />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Routes protégées */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="account" element={<Account />} />
        <Route path="properties" element={<Properties />} />
        <Route path="applications" element={<Applications />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="chat" element={<Chat />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="resources" element={<Resources />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="tenant-file" element={<TenantFile />} />
        <Route path="search" element={<PropertySearch />} />
        <Route path="tenant-applications" element={<TenantApplications />} />
        <Route path="tenant-property" element={<TenantProperty />} />
        <Route path="tenant-incidents" element={<TenantIncidents />} />
        
        {/* Route admin */}
        <Route path="db-admin" element={
          <AdminRoute>
            <DbAdmin />
          </AdminRoute>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;