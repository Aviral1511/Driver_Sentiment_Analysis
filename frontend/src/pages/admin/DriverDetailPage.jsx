import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDriver,
    getDriverFeedback,
    getDriverAlerts,
    getDriverTimeseries,
} from '../../api/driverApi.js';
import Loader from '../../components/Loader.jsx';
import DriverChart from '../../components/DriverChart.jsx';

export default function DriverDetailPage() {
    const { id } = useParams();

    const [driver, setDriver] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [series, setSeries] = useState([]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    async function loadAll() {
        try {
            setLoading(true);
            setErr('');

            const [d, fb, al, ts] = await Promise.all([
                getDriver(id),
                getDriverFeedback(id),
                getDriverAlerts(id),
                getDriverTimeseries(id, 30),
            ]);

            setDriver(d);
            setFeedback(fb);
            setAlerts(al);
            setSeries(ts);
            // console.log(fb);
        } catch {
            setErr('Failed to load driver details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadAll(); }, [id]);

    if (loading) return <Loader full={true} label="Loading driver…" />;
    if (err) return <div className="p-4 text-red-600">{err}</div>;
    if (!driver) return <div className="p-4 text-neutral-600">Driver not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

            {/* Driver Header */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-bold">{driver.name}</h2>
                <div className="text-sm text-neutral-600">Phone No - {driver.phone}</div>

                <div className="mt-3 flex gap-6 text-sm">
                    <div>
                        <span className="text-neutral-500">Avg Rating:</span>{' '}
                        <strong>{Number(driver?.stats?.avg || 0).toFixed(2)} ⭐ </strong>
                    </div>
                    <div>
                        <span className="text-neutral-500">Feedback Count:</span>{' '}
                        <strong>{driver?.stats?.n || 0}</strong>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <DriverChart data={series} />

            {/* Recent Feedback */}
            <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Recent Feedback</h3>

                {!feedback.length ? (
                    <div className="text-sm text-neutral-500">No feedback available.</div>
                ) : (
                    <div className="grid gap-3">
                        {feedback.map((fb) => (
                            <div key={fb._id} className="border border-neutral-200 rounded-lg p-3">
                                <div className="text-xs text-neutral-500">
                                    {new Date(fb.createdAt).toLocaleString()}
                                </div>
                                <div className="text-md mt-1 font-bold">{fb?.riderId?.name}</div>
                                <div className="text-sm mt-1">{fb.text}</div>
                                <div className="text-sm mt-1">
                                    {fb.stars ?? fb?.sentiment?.mappedStars ?? '?'} ⭐
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Alerts */}
            <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>

                {!alerts.length ? (
                    <div className="text-sm text-neutral-500">No alerts for this driver.</div>
                ) : (
                    <div className="grid gap-3">
                        {alerts.map((al) => (
                            <div key={al._id} className="border border-neutral-200 rounded-lg p-3">
                                <div className="text-xs text-neutral-500">
                                    {new Date(al.createdAt).toLocaleString()}
                                </div>
                                <div className="text-sm">
                                    Average Rating : {Number(al.avgAtEvent).toFixed(2)}⭐
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
