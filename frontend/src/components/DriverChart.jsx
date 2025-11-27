import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DriverChart({ data = [] }) {
    if (!data.length) {
        return (
            <div className="text-sm text-neutral-500 border border-neutral-200 rounded-lg p-4">
                No data available for this driver.
            </div>
        );
    }

    const chartData = {
        labels: data.map((d) =>
            new Date(d.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short'
            })
        ),
        datasets: [
            {
                label: 'Rating',
                data: data.map((d) => Number(d.stars)),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const opts = {
        responsive: true,
        scales: {
            y: {
                min: 1,
                max: 5,
            },
        },
    };

    return (
        <div className="rounded-xl border border-neutral-200 p-4 bg-white">
            <h3 className="text-lg font-semibold mb-3">Recent Feedback Trend</h3>
            <Line data={chartData} options={opts} height={100} />
        </div>
    );
}

