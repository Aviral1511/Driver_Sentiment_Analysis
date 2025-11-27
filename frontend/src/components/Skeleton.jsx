// src/components/Skeleton.jsx
import React from 'react';

export function Skeleton({ className = '' }) {
    return <div className={`animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 ${className}`} />;
}

/** Handy preset for stat cards (matches your StatsCard size) */
export function SkeletonStatCard() {
    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-7 w-16" />
        </div>
    );
}

/** Generic list row skeleton */
export function SkeletonRow() {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}
