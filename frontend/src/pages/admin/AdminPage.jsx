import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <h1 className="text-2xl font-semibold text-neutral-900">Admin</h1>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                    to="/admin/analytics"
                    className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow hover:bg-gray-100 transition"
                >
                    <div className="text-lg font-semibold text-neutral-900">Analytics</div>
                    <div className="mt-1 text-md text-neutral-700">Overview, risky drivers, time series.</div>
                </Link>
                <Link
                    to="/admin/alerts"
                    className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow hover:bg-gray-100 transition"
                >
                    <div className="text-lg font-semibold text-neutral-900">Alerts</div>
                    <div className="mt-1 text-md text-neutral-700">Recent alerts & controls.</div>
                </Link>
            </div>
        </div>
    );
}
