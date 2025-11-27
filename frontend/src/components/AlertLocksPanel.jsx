import React, { useState } from 'react';

export default function AlertLocksPanel({ locks = [], onMute, onUnmute }) {
    const [driverId, setDriverId] = useState('');
    const [minutes, setMinutes] = useState(60);

    return (
        <div className="p-4">
            {/* Quick mute */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Driver ID</label>
                    <input
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="driverId to mute"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value.trim())}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Minutes</label>
                    <input
                        type="number"
                        min="1"
                        max="1440"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => driverId && onMute(driverId, minutes)}
                        className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Mute driver
                    </button>
                </div>
            </div>

            {/* Locks list */}
            {!locks.length ? (
                <div className="px-1 py-8 text-center text-sm text-neutral-500">No active locks.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 text-neutral-700">
                            <tr>
                                <th className="text-left px-4 py-2 font-medium">Driver</th>
                                <th className="text-left px-4 py-2 font-medium">Expires</th>
                                <th className="text-left px-4 py-2 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locks.map((l) => (
                                <tr key={l._id} className="border-t border-neutral-200 hover:bg-neutral-50">
                                    <td className="px-4 py-2 font-mono text-xs">{l.driverId}</td>
                                    <td className="px-4 py-2">{new Date(l.expireAt).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => onUnmute(l.driverId)}
                                            className="px-3 py-1 rounded-md border border-neutral-300 hover:bg-neutral-100 transition"
                                        >
                                            Unmute
                                        </button>
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
