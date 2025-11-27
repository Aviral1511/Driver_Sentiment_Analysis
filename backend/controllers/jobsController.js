import Job from '../models/Job.js';

export async function listJobs(req, res) {
  const status = (req.query.status || 'queued').toLowerCase();
  const limit = Math.min(Math.max(parseInt(req.query.limit ?? '50', 10), 1), 200);
  const rows = await Job.find({ status }).sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ items: rows });
}

export async function retryJob(req, res) {
  const { id } = req.params;
  const j = await Job.findById(id).lean();
  if (!j) return res.status(404).json({ error: 'not_found' });
  await Job.updateOne({ _id: id }, { $set: { status: 'queued', lastError: null } });
  res.json({ ok: true });
}

export async function purgeDone(req, res) {
  const beforeDays = Math.max(parseInt(req.query.days ?? '7', 10), 1);
  const cutoff = new Date(Date.now() - beforeDays * 24 * 60 * 60 * 1000);
  const r = await Job.deleteMany({ status: 'done', finishedAt: { $lte: cutoff } });
  res.json({ deleted: r.deletedCount });
}
