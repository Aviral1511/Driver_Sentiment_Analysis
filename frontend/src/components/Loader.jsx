// src/components/Loader.jsx
import React from 'react';

export default function Loader({ full = false, label = 'Loading…' }) {
    const wrapper = full
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40'
        : 'inline-flex items-center gap-2';

    return (
        <div className={wrapper}>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent" />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
        </div>
    );
}
