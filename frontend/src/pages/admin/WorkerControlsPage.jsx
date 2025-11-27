import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader.jsx';
import {
    getWorkerStatus,
    workerPause,
    workerResume,
    workerRunOnce,
} from '../../api/alertsApi.js';

export default function WorkerControlsPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [auto, setAuto] = useState(true);
    const [err, setErr] = useState('');

    async function load() {
        try {
            setLoading(true);
            const s = await getWorkerStatus();
            setStatus(s);
            setErr('');
        } catch (e) {
            setErr('Failed to load status');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // auto refresh
        if (!auto) return;
        const t = setInterval(load, 4000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auto]);

    async function doPause() {
        await workerPause();
        await load();
    }
    async function doResume() {
        await workerResume();
        await load();
    }
    async function doRunOnce() {
        await workerRunOnce();
        await load();
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="flex items-center justify-between gap-3 mb-6">
                <h1 className="text-2xl font-bold">Worker Controls</h1>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-neutral-600">Auto refresh</label>
                    <button
                        onClick={() => setAuto((v) => !v)}
                        className={`px-3 py-1 rounded-lg text-sm border transition
              ${auto ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}
                    >
                        {auto ? 'On' : 'Off'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-600">Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-sm border
              ${status?.paused
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {status?.paused ? 'Paused' : 'Running'}
                        </span>
                    </div>
                    {loading && <Loader label="Updating…" />}
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        onClick={doPause}
                        className="h-10 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
                    >
                        Pause
                    </button>
                    <button
                        onClick={doResume}
                        className="h-10 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        Resume
                    </button>
                    <button
                        onClick={doRunOnce}
                        className="h-10 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition"
                    >
                        Run once
                    </button>
                </div>

                {/* Optional stats display */}
                <div className="p-4 border-t border-neutral-200 text-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg bg-neutral-50 p-3">
                        <div className="text-neutral-600">Claimed</div>
                        <div className="text-xl font-semibold">{status?.claimed ?? 0}</div>
                    </div>
                    <div className="rounded-lg bg-neutral-50 p-3">
                        <div className="text-neutral-600">Processed</div>
                        <div className="text-xl font-semibold">{status?.processed ?? 0}</div>
                    </div>
                    <div className="rounded-lg bg-neutral-50 p-3">
                        <div className="text-neutral-600">Errors</div>
                        <div className="text-xl font-semibold">{status?.errors ?? 0}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
