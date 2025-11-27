import React, { useState } from 'react';
import api from '../api/apiClient.js';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import DriverFinder from '../components/DriverFinder.jsx';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchDriverAlerts } from '../api/alertsApi.js';

export default function FeedbackPage() {
    const cfg = useSelector((s) => s.config.data);
    const [driverId, setDriverId] = useState('');
    const [stars, setStars] = useState();
    const [text, setText] = useState('');
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const features = cfg?.features || { driverFeedback: true, tripFeedback: true, appFeedback: true, marshalFeedback: false };

    async function submit(e) {
        e.preventDefault();
        // if (!driverId) return; // safety
        setLoading(true);
        setMsg(null);
        try {
            const dedupeKey = uuidv4();
            const payload = { driverId, text, dedupeKey };
            const starsNum = Number(stars);
            if (stars !== '' && Number.isFinite(starsNum) && starsNum >= 1 && starsNum <= 5) {
                payload.stars = starsNum;
            }
            const { data } = await api.post('/feedback', payload);
            setMsg(`✅ Feedback submitted successfully`);
            toast.success(`Feedback submitted successfully`);

            if (driverId) {
                let tries = 5; // ~5 seconds total
                let lastSeenTs = Date.now() - 5 * 60 * 1000; // only count very fresh alerts
                const pollOnce = async () => {
                    const rows = await fetchDriverAlerts(driverId, { limit: 5 });
                    const recent = rows.find(r => new Date(r.createdAt).getTime() > lastSeenTs);
                    if (recent) {
                        toast.warn(
                            `⚠️ Driver at risk: avg rating ${Number(recent.avgAtEvent).toFixed(2)} ⭐`,
                            { autoClose: 1000 }
                        );
                        return true;
                    }
                    return false;
                };
                let found = await pollOnce();
                while (!found && tries-- > 0) {
                    await new Promise(r => setTimeout(r, 1000));
                    found = await pollOnce();
                }
            }

            setDriverId('');
            setStars();
            setText('');
        } catch (err) {
            setMsg(`❌ Failed to submit feedback: Something went wrong.`);
            toast.error(`Failed to submit feedback: Something went wrong.`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!msg) return;
        const timer = setTimeout(() => setMsg(null), 3000);
        return () => clearTimeout(timer);
    }, [msg]);

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Submit Feedback</h2>
            {/* <p className="text-sm text-neutral-600 mb-6">
                Use the driver finder to select a driver. Stars are optional if your backend maps sentiment.
            </p> */}

            {/* flags line */}
            {/* <div className="mb-6 text-xs text-neutral-500">
                <b>Feature flags:</b>{' '}
                {Object.entries(features).map(([k, v]) => `${k}:${v}`).join(' | ')}
            </div> */}

            <form onSubmit={submit} className="grid gap-4 max-w-xl">
                <DriverFinder
                    label="Driver"
                    required
                    value={driverId}
                    onChange={(id /*, driver */) => setDriverId(id)}
                    placeholder="Start typing driver name or phone…"
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Stars (1–5)</label>
                    <input
                        type="number"
                        min="0"
                        max="5"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        className="w-32 rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Feedback  <span className="text-red-500">*</span></label>
                    <textarea
                        rows="5"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !driverId}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 text-gray-100 cursor-pointer hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? 'Submitting…' : 'Submit'}
                </button>
            </form>

            {msg && (
                <pre className="bg-neutral-100 border border-neutral-300 rounded-lg p-3 mt-6 text-lg overflow-auto">
                    {msg}
                </pre>
            )}
        </div>
    );
}
