import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient.js';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';

export default function DriversPage() {
    const [rows, setRows] = useState([]);
    const [minCount, setMinCount] = useState(0);
    const [limit, setLimit] = useState(20);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    async function fetchData() {
        try {
            setLoading(true);
            const { data } = await api.get(`/analytics/risky-drivers?minCount=${minCount}&limit=${limit}`);
            setRows(data.items || []);
            setErr('');
        } catch (e) {
            setErr('risky_drivers_failed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, []); // initial

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Drivers (Risk Ranking)</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        value={minCount}
                        onChange={(e) => setMinCount(Number(e.target.value))}
                        className="w-28 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        placeholder="minCount"
                        aria-label="minCount"
                    />
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        placeholder="limit"
                        aria-label="limit"
                    />
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {loading && <Loader />}

            {err && (
                <div className="text-sm text-red-600 mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {err}
                </div>
            )}

            {!loading && !rows.length && !err && (
                <div className="text-sm text-neutral-600">No drivers found for the current filters.</div>
            )}

            {!!rows.length && (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-neutral-200 rounded-lg overflow-hidden">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">S.NO</th>
                                <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">Driver</th>
                                <th className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">Phone</th>
                                <th className="text-right text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">Count</th>
                                <th className="text-right text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">Avg</th>
                                <th className="text-right text-xs font-semibold uppercase tracking-wide text-neutral-600 px-4 py-3 border-b">Updated</th>
                                <th className="px-4 py-3 border-b" />
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((r, i) => (
                                <tr key={r._id} className="hover:bg-neutral-50">
                                    <td className="px-4 py-3 text-sm font-medium text-neutral-800">{i + 1 + `.`}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-neutral-800">{r.name || '—'}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-700">{r.phone || '—'}</td>
                                    <td className="px-4 py-3 text-right text-sm tabular-nums text-neutral-800">{r?.stats?.n ?? 0}</td>
                                    <td className="px-4 py-3 text-right text-sm tabular-nums">
                                        <span className={Number(r?.stats?.avg) < 2.5 ? 'text-red-600' : 'text-neutral-800'}>
                                            {Number(r?.stats?.avg || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-neutral-500">
                                        {r?.stats?.lastUpdatedAt ? new Date(r.stats.lastUpdatedAt).toLocaleString() : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/admin/driver/${r._id}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
