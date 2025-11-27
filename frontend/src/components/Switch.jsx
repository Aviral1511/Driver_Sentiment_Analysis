// src/components/Switch.jsx
import React from 'react';

export default function Switch({ checked, onChange, label, id }) {
    return (
        <label htmlFor={id} className="flex items-center justify-between gap-4 py-2">
            <span className="text-sm font-medium text-neutral-800">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-blue-600' : 'bg-neutral-300'
                    }`}
                aria-pressed={checked}
                aria-label={label}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-1'
                        }`}
                />
            </button>
            <input
                id={id}
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    );
}
