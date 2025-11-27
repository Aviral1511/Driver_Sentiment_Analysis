import React from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export default function AreaLineChart({ data }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-neutral-700">Driver Daily Average</div>
            <div className="h-64 w-full">
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[1, 5]} allowDecimals />
                        <Tooltip />
                        <Area type="monotone" dataKey="avg" stroke="#3B82F6" fill="url(#c)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
