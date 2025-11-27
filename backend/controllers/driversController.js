import Driver from '../models/Driver.js';
import mongoose from 'mongoose';

export async function listDrivers(req, res) {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Driver.find({})
      .sort({ 'stats.avg': 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Driver.countDocuments({})
  ]);

  res.json({
    page, limit, total, items
  });
}

export async function searchDrivers(req, res) {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ items: [] });

  // naive text search across name/phone
  const items = await Driver.find({
    $or: [
      { name: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') }
    ]
  })
    .select('name phone stats.avg stats.n')
    .limit(20)
    .lean();

  res.json({ items });
}

export async function getDriverById(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid driver id' });
  }

  const driver = await Driver.findById(id).lean();
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  res.json({ driver });
}
