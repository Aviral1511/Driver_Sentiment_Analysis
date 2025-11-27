import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient.js';
import DriverFinder from '../../components/DriverFinder.jsx';
import Loader from '../../components/Loader.jsx';

export default function AlertsPage() {
    const [driverId, setDriverId] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    async function fetchAlerts(id = '') {
        setLoading(true);
        setErr('');
        try {
            const { data } = await api.get('/alerts/recent', {
                params: id ? { driverId: id, limit: 100 } : { limit: 100 }
            });
            setItems(data?.items || []);
            console.log(data);
        } catch (e) {
            setErr('recent_alerts_failed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchAlerts(''); }, []);

    function onDriverChange(id) {
        setDriverId(id);
        fetchAlerts(id || '');
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-6">
            <div className="flex items-end justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Alerts</h2>
                <div className="w-96">
                    <DriverFinder
                        label="Filter by Driver"
                        value={driverId._id}
                        onChange={(id) => onDriverChange(id)}
                        placeholder="Type name or phone…"
                    />
                </div>
            </div>

            {loading ? (
                <Loader label="Loading alerts…" />
            ) : err ? (
                <div className="text-sm text-red-600">{err}</div>
            ) : items.length === 0 ? (
                <div className="text-sm text-neutral-500 border border-dashed border-neutral-300 rounded-lg p-6">
                    No alerts found{driverId ? ' for this driver' : ''}.
                </div>
            ) : (
                <div className="overflow-auto rounded-lg border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-300 text-neutral-700">
                            <tr>
                                <th className="px-3 py-2 text-left">S No</th>
                                <th className="px-3 py-2 text-left">Time</th>
                                <th className="px-3 py-2 text-left">Driver Name</th>
                                <th className="px-3 py-2 text-left">Phone No</th>
                                <th className="px-3 py-2 text-left">Rating </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((a, i) => (
                                <tr key={a._id} className="border-t border-neutral-300 hover:bg-neutral-100">
                                    <td className="px-3 py-2">{i + 1 + `.`}</td>
                                    <td className="px-3 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                                    <td className="px-3 py-2 font-mono text-md font-bold">{a.driverId?.name || "-"}</td>
                                    <td className="px-3 py-2 font-mono text-md font-bold">{a.driverId?.phone || "-"}</td>
                                    <td className="px-3 py-2">{Number(a.avgAtEvent || 0).toFixed(2)} ⭐</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
