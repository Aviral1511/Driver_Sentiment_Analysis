import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchConfig } from './redux/slices/configSlice.js';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AlertsPage from './pages/admin/AlertsPage.jsx';
import DriversPage from './pages/admin/DriversPage.jsx';
import DriverDetailPage from './pages/admin/DriverDetailPage.jsx';
import ConfigPage from './pages/admin/ConfigPage.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import WorkerControlsPage from './pages/admin/WorkerControlsPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoutes allowedRoles={['admin', 'ops']} />}>
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/alerts" element={<AlertsPage />} />
            <Route path="/admin/drivers" element={<DriversPage />} />
            <Route path="/admin/driver/:id" element={<DriverDetailPage />} />
            <Route path="/admin/config" element={<ConfigPage />} />
            <Route path="/admin/worker" element={<WorkerControlsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="light"
        pauseOnHover
        newestOnTop
        closeOnClick
      />
    </div>
  );
}
