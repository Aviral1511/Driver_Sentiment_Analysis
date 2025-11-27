import Feedback from '../models/Feedback.js';
import Job from '../models/Job.js';
import mongoose from 'mongoose';
import Driver from '../models/Driver.js'; // optional: to ensure driver exists

// Minimal inline validation to avoid extra deps right now
function validate(body) {
  const errors = [];
  if (!body || typeof body !== 'object') errors.push('Invalid body');
  if (!body?.driverId) errors.push('driverId is required');
  if (!body?.text || typeof body.text !== 'string' || !body.text.trim()) errors.push('text is required');
  if (body?.stars != null) {
    const s = Number(body.stars);
    if (!Number.isInteger(s) || s < 1 || s > 5) errors.push('stars must be an integer 1..5');
  }
  if (errors.length) {
    const e = new Error(errors.join(', '));
    e.status = 400;
    throw e;
  }
}

export async function postFeedback(req, res) {
  validate(req.body);
  const { driverId, tripId, text, stars, dedupeKey } = req.body;

  // Optional: ensure driver exists (skip for speed if you want)
  // const d = await Driver.findById(driverId).lean();
  // if (!d) return res.status(404).json({ message: 'Driver not found' });

  // Try insert with unique dedupeKey; if duplicate, treat as success (idempotency)
  const riderId = req.user?.id;
  let nstars = stars;
  if (!(Number.isFinite(stars) && stars >= 1 && stars <= 5)) {
  nstars = undefined; // let worker map from sentiment
}

  let fbDoc;
  try {
    fbDoc = await Feedback.create({
      driverId,
      tripId,
      riderId,
      text: text.trim(),
      stars: nstars ?? undefined,
      dedupeKey: dedupeKey ?? undefined,
      createdAt: new Date()
    });
  } catch (e) {
    // Mongo duplicate key on dedupeKey
    if (e?.code === 11000 && e?.keyPattern?.dedupeKey) {
      return res.status(200).json({ status: 'duplicate_ignored' });
    }
    throw e;
  }

  // Enqueue a job in Mongo (status 'queued')
  await Job.create({
    type: 'process_feedback',
    payload: { feedbackId: fbDoc._id },
    status: 'queued',
    createdAt: new Date()
  });

  return res.status(202).json({ status: 'queued', feedbackId: fbDoc._id });
}

export async function getFeedbackByDriver(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid_driver_id' });
    }

    const items = await Feedback.find({ driverId: id })
      .sort({ createdAt: -1 })
      .select('text stars sentiment createdAt riderId')
      .populate('riderId', 'name email') 
      .limit(200)
      .lean();

    res.json({ items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'feedback_by_driver_failed' });
  }
}
