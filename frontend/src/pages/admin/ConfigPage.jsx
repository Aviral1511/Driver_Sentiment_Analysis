// src/pages/admin/ConfigPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConfig, updateConfig, clearSaveState } from '../../redux/slices/configSlice.js';
import Loader from '../../components/Loader.jsx';
import Switch from '../../components/Switch.jsx';

export default function ConfigPage() {
    const dispatch = useDispatch();
    const { data, loading, error, saving, saveOk, saveError } = useSelector((s) => s.config);

    const [form, setForm] = useState({
        alert: { threshold: 2.5, cooldownMinutes: 30, burstWindowSec: 120 },
        features: { driverFeedback: true, tripFeedback: true, appFeedback: true, marshalFeedback: false },
    });

    useEffect(() => {
        dispatch(fetchConfig());
    }, [dispatch]);

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    useEffect(() => {
        if (saveOk) {
            const t = setTimeout(() => dispatch(clearSaveState()), 1500);
            return () => clearTimeout(t);
        }
    }, [saveOk, dispatch]);

    function setAlertField(key, val) {
        setForm((f) => ({ ...f, alert: { ...f.alert, [key]: val } }));
    }
    function setFeature(key, val) {
        setForm((f) => ({ ...f, features: { ...f.features, [key]: val } }));
    }

    function submit(e) {
        e.preventDefault();
        dispatch(updateConfig(form));
    }

    return (
        <div className="mx-auto max-w-3xl p-4">
            <h1 className="text-2xl font-bold mb-4">Configuration</h1>

            {loading && <Loader label="Loading configuration..." />}
            {error && <div className="text-red-600 text-sm mb-3">Failed to load configuration.</div>}

            {data && (
                <form onSubmit={submit} className="space-y-6 bg-white rounded-xl shadow p-5">
                    <section>
                        <h2 className="text-lg font-semibold mb-2">Alerts</h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Threshold</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={form.alert.threshold}
                                    onChange={(e) => setAlertField('threshold', Number(e.target.value))}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-neutral-500 mt-1">Alert when driver avg &lt; threshold.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Cooldown (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1440"
                                    value={form.alert.cooldownMinutes}
                                    onChange={(e) => setAlertField('cooldownMinutes', Number(e.target.value))}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-neutral-500 mt-1">No repeated alerts within this period.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Burst window (sec)</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="3600"
                                    value={form.alert.burstWindowSec}
                                    onChange={(e) => setAlertField('burstWindowSec', Number(e.target.value))}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-neutral-500 mt-1">At most 1 alert emitted per window.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">Feature Flags</h2>
                        <div className="rounded-lg border border-neutral-200 p-4 divide-y">
                            <Switch
                                id="ff-driver"
                                label="Driver Feedback"
                                checked={!!form.features.driverFeedback}
                                onChange={(v) => setFeature('driverFeedback', v)}
                            />
                            <Switch
                                id="ff-trip"
                                label="Trip Feedback"
                                checked={!!form.features.tripFeedback}
                                onChange={(v) => setFeature('tripFeedback', v)}
                            />
                            <Switch
                                id="ff-app"
                                label="App Feedback"
                                checked={!!form.features.appFeedback}
                                onChange={(v) => setFeature('appFeedback', v)}
                            />
                            <Switch
                                id="ff-marshal"
                                label="Marshal Feedback"
                                checked={!!form.features.marshalFeedback}
                                onChange={(v) => setFeature('marshalFeedback', v)}
                            />
                        </div>
                    </section>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>

                        {saveOk && <span className="text-green-600 text-sm">Saved!</span>}
                        {saveError && <span className="text-red-600 text-sm">{String(saveError)}</span>}
                    </div>
                </form>
            )}
        </div>
    );
}
