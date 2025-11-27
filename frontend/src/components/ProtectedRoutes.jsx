// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ role }) {
    const { token, user } = useSelector((s) => s.auth);
    if (!token) return <Navigate to="/login" replace />;

    if (role && user?.role !== role) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
