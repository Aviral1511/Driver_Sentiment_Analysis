import React from 'react';

export default function AlertsTable({ items = [] }) {
    if (!items.length) {
        return (
            <div className="px-4 py-10 text-center text-sm text-neutral-500">
                No alerts yet in this range.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-700">
                    <tr>
                        <th className="text-left px-4 py-2 font-medium">Time</th>
                        <th className="text-left px-4 py-2 font-medium">Driver</th>
                        <th className="text-left px-4 py-2 font-medium">Avg at Event</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((r) => (
                        <tr key={r._id} className="border-t border-neutral-200 hover:bg-neutral-100">
                            <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-2 font-mono text-xs">{r.driverId}</td>
                            <td className="px-4 py-2">
                                <span className="inline-flex items-center rounded-md px-2 py-0.5 bg-red-50 text-red-700 border border-red-200">
                                    {Number(r.avgAtEvent || 0).toFixed(2)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
