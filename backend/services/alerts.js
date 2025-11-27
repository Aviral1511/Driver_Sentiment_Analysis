import mongoose from 'mongoose';
import AlertEvent from '../models/AlertEvent.js';
import AlertLock from '../models/AlertLock.js';
import Config from '../models/Config.js';

export async function maybeEmitAlert(driverId, avg) {
  const cfg = await Config.findById('global').lean();
  const threshold = cfg?.alert?.threshold ?? 2.5;
  const cooldownMinutes = cfg?.alert?.cooldownMinutes ?? 30;
  const burstWindowSec = cfg?.alert?.burstWindowSec ?? 120;

  if (avg >= threshold) return false;

  const now = new Date();
  const expireAt = new Date(now.getTime() + cooldownMinutes * 60 * 1000);

  try {
    await AlertLock.create({
      driverId: new mongoose.Types.ObjectId(driverId),
      expireAt
    });
  } catch (e) {
    if (e.code === 11000) return false;
    throw e;
  }

  const since = new Date(now.getTime() - burstWindowSec * 1000);
  const recent = await AlertEvent.countDocuments({
    driverId: new mongoose.Types.ObjectId(driverId),
    createdAt: { $gte: since }
  });

  if (recent >= 1) {
    await AlertLock.deleteOne({ driverId });
    return false;
  }

  await AlertEvent.create({
    driverId,
    avgAtEvent: avg,
    createdAt: now
  });

  console.log(`[ALERT] Driver ${driverId} avg=${avg.toFixed(2)} at ${now.toISOString()}`);

  return true;
}
