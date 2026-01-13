import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import Lessons from '../pages/Lessons/Lessons';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound';
import Services from '../pages/Servicespage/Services';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService/TermsOfService';
import AdminLogin from '../pages/Admin/AdminLogin';
import UserDashboard from '../pages/Dashboard/UserDashboard';
import MyServices from '../pages/Dashboard/MyServices';
import Tradelines from '../pages/Dashboard/Tradelines';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';

/* =========================
   Route Guards
========================= */

// Authenticated (user OR admin)
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    const isAdminPath = window.location.pathname.startsWith('/admin');
    return <Navigate to={isAdminPath ? '/admin/login' : '/login'} replace />;
  }

  return <Outlet />;
}

// Admin only
function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// User only
function UserRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

// Public only (login/signup)
function PublicRoute() {
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
}

/* =========================
   Routes
========================= */

export default function AppRoutes() {
  return (
    <Routes>

      {/* ---------- Public routes ---------- */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* ---------- Main layout ---------- */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---------- Protected routes ---------- */}
      <Route element={<ProtectedRoute />}>

        {/* Admin dashboard */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* User dashboard */}
        <Route element={<UserRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/services" element={<MyServices />} />
            <Route path="/dashboard/tradelines" element={<Tradelines />} />
            <Route path="/lessons" element={<Lessons />} />
          </Route>
        </Route>

      </Route>

    </Routes>
  );
}
