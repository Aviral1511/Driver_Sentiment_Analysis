import AlertEvent from '../models/AlertEvent.js';
import AlertLock from '../models/AlertLock.js';

export async function maybeEmitAlert(driverId, avg, cfg) {
  const now = new Date();
  const cooldownMinutes = cfg?.alert?.cooldownMinutes ?? 30;
  const burstWindowSec  = cfg?.alert?.burstWindowSec ?? 120;

  // Try to insert a lock (unique per driver). If it exists -> skip
  const expireAt = new Date(now.getTime() + cooldownMinutes * 60 * 1000);
  try {
    await AlertLock.create({ driverId, expireAt });
  } catch (e) {
    if (e && e.code === 11000) {
      // lock exists, within cooldown
      return false;
    }
    throw e;
  }

  // Enforce burst window: only 1 alert within the last X seconds
  const since = new Date(now.getTime() - burstWindowSec * 1000);
  const recentCount = await AlertEvent.countDocuments({ driverId, createdAt: { $gte: since } });
  if (recentCount >= 1) {
    // remove the lock we just inserted; let next attempt try later
    await AlertLock.deleteOne({ driverId });
    return false;
  }

  // Record alert event (you can also integrate email/webhook here later)
  await AlertEvent.create({ driverId, avgAtEvent: avg, createdAt: now });
  // For now, just log
  // eslint-disable-next-line no-console
  console.log(`[ALERT] driver=${driverId} avg=${avg?.toFixed?.(2)} at ${now.toISOString()}`);
  return true;
}
