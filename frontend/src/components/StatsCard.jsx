import React from 'react';

export default function StatsCard({ label, value, subtitle }) {
    return (
        <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-md">
            <div className="text-sm text-gray-700">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-600">{value}</div>
            {subtitle && <div className="mt-1 text-xs text-gray-600">{subtitle}</div>}
        </div>
    );
}
