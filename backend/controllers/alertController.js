// backend/controllers/alertController.js
import AlertEvent from '../models/AlertEvent.js';
import AlertLock from '../models/AlertLock.js';
import mongoose from 'mongoose';

const { Types } = mongoose;

function ensureValidObjectId(id) {
  return Types.ObjectId.isValid(id);
}

/**
 * GET /api/alerts/recent?limit=50&driverId=<id>
 */
export async function getRecentAlerts(req, res) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '50', 10), 1), 200);
    const filter = {};
    if (req.query.driverId) {
      if (!ensureValidObjectId(req.query.driverId)) {
        return res.status(400).json({ error: 'invalid_driver_id' });
      }
      filter.driverId = req.query.driverId; // Mongoose will cast
    }
    const rows = await AlertEvent.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('driverId', 'name phone')
      .populate('userId', 'name ') 
      .lean();
    
    // console.log(rows);
    res.json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'recent_alerts_failed' });
  }
}

/**
 * GET /api/alerts/driver/:id
 */
export async function getDriverAlerts(req, res) {
  try {
    const { id } = req.params;
    if (!ensureValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid_driver_id' });
    }
    const rows = await AlertEvent.find({ driverId: id })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('userId', 'name email role') 
      .lean();
    res.json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'driver_alerts_failed' });
  }
}

/**
 * GET /api/alerts/locks  (see cooldowns currently active)
 * Optional ?driverId=<id>
 */
export async function getAlertLocks(req, res) {
  try {
    const filter = {};
    if (req.query.driverId) {
      if (!ensureValidObjectId(req.query.driverId)) {
        return res.status(400).json({ error: 'invalid_driver_id' });
      }
      filter.driverId = req.query.driverId;
    }
    const rows = await AlertLock.find(filter).sort({ expireAt: 1 }).lean();
    res.json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'locks_failed' });
  }
}

/**
 * POST /api/alerts/mute/:driverId?minutes=60
 * Manually mute alerts for a driver by creating/updating a TTL lock.
 */
export async function muteDriverAlerts(req, res) {
  try {
    const { driverId } = req.params;
    if (!ensureValidObjectId(driverId)) {
      return res.status(400).json({ error: 'invalid_driver_id' });
    }
    const minutes = Math.min(Math.max(parseInt(req.query.minutes ?? '60', 10), 1), 24 * 60);
    const expireAt = new Date(Date.now() + minutes * 60 * 1000);

    const doc = await AlertLock.findOneAndUpdate(
      { driverId },
      { $set: { expireAt } },
      { new: true, upsert: true }
    ).lean();

    res.json({ ok: true, lock: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'mute_failed' });
  }
}

/**
 * DELETE /api/alerts/mute/:driverId
 * Manually unmute (delete TTL lock).
 */
export async function unmuteDriverAlerts(req, res) {
  try {
    const { driverId } = req.params;
    if (!ensureValidObjectId(driverId)) {
      return res.status(400).json({ error: 'invalid_driver_id' });
    }
    await AlertLock.deleteOne({ driverId });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'unmute_failed' });
  }
}
