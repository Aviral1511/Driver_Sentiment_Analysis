import Config from '../models/Config.js';

/** GET /api/config */
export async function getConfig(req, res) {
  const cfg = await Config.findById('global').lean();
  // if you didn't seed yet, create a minimal default on the fly:
  if (!cfg) {
    const created = await Config.create({
      _id: 'global',
      alert: { threshold: 2.5, cooldownMinutes: 30, burstWindowSec: 120 },
      features: { driverFeedback: true, tripFeedback: true, appFeedback: true, marshalFeedback: false }
    });
    return res.json(created);
  }
  return res.json(cfg);
}

/** PUT /api/config  (keep open for now; later lock to admin) */
export async function updateConfig(req, res) {
  const { alert, features } = req.body ?? {};
  const updated = await Config.findByIdAndUpdate(
    'global',
    {
      ...(alert ? { alert } : {}),
      ...(features ? { features } : {})
    },
    { new: true, upsert: true }
  ).lean();
  return res.json(updated);
}
