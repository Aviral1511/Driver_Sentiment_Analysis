import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient.js';
import StatsCard from '../../components/StatsCard.jsx';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await api.get('/analytics/overview');
            setData(data);
        })();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            {data ? (
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatsCard label="Total Feedback" value={data.total} />
                    <StatsCard label="Average Rating" value={Number(data.avgAll || 0).toFixed(2)} />
                    <StatsCard label="Negative %" value={`${Number(data.negativePct || 0).toFixed(1)}%`} />
                </div>
            ) : (
                <div className="text-sm text-gray-500">Loading…</div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/admin/alerts" className="block rounded-lg border bg-white p-4 hover:shadow">
                    <div className="font-medium mb-1">Alerts</div>
                    <div className="text-sm text-gray-600">View recent alert events and locks.</div>
                </Link>
                <Link to="/admin/drivers" className="block rounded-lg border bg-white p-4 hover:shadow">
                    <div className="font-medium mb-1">Drivers</div>
                    <div className="text-sm text-gray-600">Risky drivers and details.</div>
                </Link>
                <Link to="/admin/config" className="block rounded-lg border bg-white p-4 hover:shadow">
                    <div className="font-medium mb-1">Config</div>
                    <div className="text-sm text-gray-600">Thresholds & feature flags.</div>
                </Link>
            </div>
        </div>
    );
}
