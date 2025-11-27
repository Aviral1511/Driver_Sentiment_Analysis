import React, { useEffect, useRef, useState } from 'react';
import { searchDrivers, getDriver } from '../api/driverApi.js';

export default function DriverFinder({
    value = '',
    onChange = () => { },
    label = 'Driver',
    placeholder = 'Type driver name or phone...',
    required = false,
}) {
    const [input, setInput] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null); // { _id, name, phone, stats }

    const boxRef = useRef(null);
    const debounceRef = useRef(null);

    // If value (driverId) comes from parent, hydrate selected label
    useEffect(() => {
        let active = true;
        (async () => {
            if (!value) {
                setSelected(null);
                setInput('');
                return;
            }
            try {
                const d = await getDriver(value);
                if (active && d) {
                    setSelected(d);
                    setInput(`${d.name} (${d.phone})`);
                }
            } catch {
                /* ignore */
            }
        })();
        return () => { active = false; };
    }, [value]);

    // Click outside to close
    useEffect(() => {
        function onDoc(e) {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    // Search with debounce (300ms)
    useEffect(() => {
        if (!open) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            const q = input.trim();
            if (!q || q.length < 2) {
                setItems([]);
                return;
            }
            setLoading(true);
            try {
                const found = await searchDrivers(q);
                setItems(found);
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => debounceRef.current && clearTimeout(debounceRef.current);
    }, [input, open]);

    function handleSelect(d) {
        setSelected(d);
        setInput(`${d.name} (${d.phone})`);
        setOpen(false);
        onChange(d._id, d);
    }

    function clearSelection() {
        setSelected(null);
        setInput('');
        setItems([]);
        setOpen(false);
        onChange('', null);
    }

    return (
        <div className="w-full" ref={boxRef}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    value={input}
                    required={required}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setSelected(null);
                        onChange('', null);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                {/* clear button */}
                {input && (
                    <button
                        type="button"
                        onClick={clearSelection}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                        title="Clear"
                    >
                        ×
                    </button>
                )}

                {/* dropdown */}
                {open && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-md">
                        {loading ? (
                            <div className="p-3 text-sm text-neutral-600">Searching…</div>
                        ) : (items.length === 0 && (!input || input.length < 2)) ? (
                            <div className="p-3 text-sm text-neutral-500">Type atleast 2 words/numbers</div>
                        ) : items.length === 0 ? (
                            <div className="p-3 text-sm text-neutral-500">No Drivers found</div>
                        ) : (
                            <ul className="max-h-64 overflow-auto">
                                {items.map((d) => (
                                    <li key={d._id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(d)}
                                            className="w-full text-left px-3 py-2 hover:bg-neutral-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-neutral-800">
                                                    {d.name} <span className="text-neutral-500">({d.phone})</span>
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    avg {Number(d?.stats?.avg || 0).toFixed(2)} ⭐ • {d?.stats?.n || 0} reviews
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {selected && (
                <div className="mt-2 text-xs text-neutral-600">
                    Selected: <b>{selected.name}</b> — {selected.phone} (avg {Number(selected?.stats?.avg || 0).toFixed(2)} ⭐)
                </div>
            )}
        </div>
    );
}
