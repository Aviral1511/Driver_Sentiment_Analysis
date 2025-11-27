import React from 'react';
import { Link } from 'react-router-dom';

export default function RiskyDriversTable({ items = [], onSelect }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
            <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                    <tr>
                        <th className="px-4 py-3 text-left">Driver</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-right">Avg Rating</th>
                        <th className="px-4 py-3 text-right">Count</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                    {items.map((d) => (
                        <tr key={d._id} className="hover:bg-neutral-100">
                            <td className="px-4 py-3">{d.name}</td>
                            <td className="px-4 py-3">{d.phone}</td>
                            <td className="px-4 py-3 text-right">{Number(d.stats?.avg ?? 0).toFixed(2)} ⭐</td>
                            <td className="px-4 py-3 text-right">{d.stats?.n ?? 0}</td>
                            <td className="px-4 py-3 text-right">
                                <Link
                                    to={`/admin/driver/${d._id}`}
                                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                                No drivers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
