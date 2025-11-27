import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/apiClient.js';
import Loader from '../../components/Loader.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import RiskyDriversTable from '../../components/RiskyDriversTable.jsx';
import AreaLineChart from '../../components/AreaLineChart.jsx';
import PieDistribution from '../../components/PieDistribution.jsx';

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [risky, setRisky] = useState([]);
    const [dist, setDist] = useState([]);
    const [selected, setSelected] = useState(null);
    const [series, setSeries] = useState([]);
    const [err, setErr] = useState('');

    // fetch overview + risky + distribution
    useEffect(() => {
        (async () => {
            setLoading(true);
            setErr('');
            try {
                const [ov, rd, di] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/risky-drivers?minCount=1&limit=10'),
                    api.get('/analytics/distribution')
                ]);
                setOverview(ov.data || null);
                setRisky(rd.data?.items || []);
                setDist(di.data?.items || []);
            } catch (e) {
                setErr('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // fetch series when driver changes
    useEffect(() => {
        if (!selected?._id) return;
        (async () => {
            try {
                const { data } = await api.get(`/analytics/driver/${selected._id}/timeseries?days=30`);
                setSeries(data?.items || []);
            } catch {
                setSeries([]);
            }
        })();
    }, [selected]);

    const cards = useMemo(() => ([
        {
            title: 'Total feedback',
            value: overview ? overview.total : '--',
            subtitle: 'In selected period',
        },
        {
            title: 'Average rating ⭐',
            value: overview ? Number(overview.avgAll || 0).toFixed(2) : '--',
            subtitle: '1.00 – 5.00',
        },
        {
            title: 'Negative %',
            value: overview ? `${Number(overview.negativePct || 0).toFixed(1)}%` : '--',
            subtitle: 'Lower is better',
        }
    ]), [overview]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-neutral-900">Analytics</h1>
            </div>

            {loading ? (
                <Loader label="Loading analytics…" />
            ) : err ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {err}
                </div>
            ) : (
                <>
                    {/* Overview cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {cards.map((c) => (
                            <StatsCard key={c.title} label={c.title} value={c.value} subtitle={c.subtitle} />
                        ))}
                    </div>

                    {/* Sentiment Distribution + Driver series */}
                    <div className="grid grid-cols-1 gap-4">
                        <PieDistribution data={dist} />
                        {/* <AreaLineChart data={series} />  */}
                    </div>

                    {/* Risky drivers */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-neutral-900">Top Risky Drivers</h2>
                            <div className="text-sm text-neutral-500">
                                Showing drivers sorted by lowest average
                            </div>
                        </div>
                        <RiskyDriversTable items={risky} onSelect={setSelected} />
                        {selected && (
                            <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                                Viewing driver: <b>{selected.name}</b> ({selected.phone}) — avg:&nbsp;
                                <b>{Number(selected.stats?.avg ?? 0).toFixed(2)}</b>, n:&nbsp;<b>{selected.stats?.n ?? 0}</b>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
