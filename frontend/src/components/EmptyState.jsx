// src/components/EmptyState.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
    title = 'Nothing here yet',
    subtitle = 'Try changing filters or come back later.',
    actionText,
    to,
}) {
    return (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                <svg className="h-6 w-6 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>

            {actionText && to && (
                <div className="mt-4">
                    <Link
                        to={to}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
                    >
                        {actionText}
                    </Link>
                </div>
            )}
        </div>
    );
}
