import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchRecentAlerts } from '../api/alertsApi.js';

/**
 * Polls recent alerts and shows a toast for new ones.
 * Runs only if user is admin and logged in.
 */
export default function useAlertToasts({ intervalMs = 10000 } = {}) {
    const { token, user } = useSelector((s) => s.auth || {});
    const seenIdsRef = useRef(new Set());
    const lastTsRef = useRef(0); // track latest createdAt timestamp to limit repeats

    useEffect(() => {
        if (!token || user?.role !== 'admin') return;

        let timer;
        const tick = async () => {
            try {
                const items = await fetchRecentAlerts({ limit: 10 });
                // sort newest first
                items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                for (const a of items) {
                    const id = String(a._id);
                    const ts = new Date(a.createdAt).getTime();
                    if (!seenIdsRef.current.has(id) && ts > lastTsRef.current) {
                        seenIdsRef.current.add(id);
                        lastTsRef.current = Math.max(lastTsRef.current, ts);
                        toast.warn(
                            `⚠️ Driver at risk: avg ${Number(a.avgAtEvent).toFixed(2)}`,
                            { autoClose: 4000 }
                        );
                    }
                }
            } catch (e) {
                // silent; avoid noisy UI on network blips
            } finally {
                timer = setTimeout(tick, intervalMs);
            }
        };

        tick();
        return () => clearTimeout(timer);
    }, [token, user?.role, intervalMs]);
}
