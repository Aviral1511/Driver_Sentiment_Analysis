// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/apiClient.js';
import Loader from '../components/Loader.jsx';
import { SkeletonStatCard } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatsCard from '../components/StatsCard.jsx';

function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{value}</div>
        </div>
    );
}

export default function HomePage() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/analytics/overview');
                setData(data);
            } catch (e) {
                setErr('overview_failed');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-4"><Loader label="Fetching overview…" /></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    {err}
                </div>
            </div>
        );
    }

    const total = Number(data?.total || 0);
    const avg = Number(data?.avgAll || 0).toFixed(2);
    const neg = Number(data?.negativePct || 0).toFixed(1);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h2 className="mb-4 text-2xl font-semibold">Overview</h2>

            {total === 0 ? (
                <EmptyState
                    title="No feedback yet"
                    subtitle="Once riders start submitting feedback, you’ll see live stats here."
                    actionText="Submit feedback"
                    to="/feedback"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatsCard label="Total feedbacks" value={total} />
                    <StatsCard label="Average rating" value={avg + `⭐`} />
                    <StatsCard label="Negative %" value={`${neg}%`} />
                </div>
            )}
        </div>
    );
}
