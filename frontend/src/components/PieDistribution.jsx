import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#EF4444', '#F59E0B', '#10B981']; // neg, neutral, pos

export default function PieDistribution({ data }) {
    // Normalize to { name, value }
    const mapped = [
        { name: 'negative', value: data.find(x => x.label === 'negative')?.count ?? 0 },
        { name: 'neutral', value: data.find(x => x.label === 'neutral')?.count ?? 0 },
        { name: 'positive', value: data.find(x => x.label === 'positive')?.count ?? 0 },
    ];

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-lg font-semibold text-neutral-700">Sentiment Distribution</div>
            <div className="h-64 w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={mapped} dataKey="value" nameKey="name" outerRadius={90} >
                            {mapped.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={24} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
