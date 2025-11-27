import Feedback from '../models/Feedback.js';
import Driver from '../models/Driver.js';
import mongoose from 'mongoose';

/**
 * Utility: parse ?from=&to= (ISO strings). Defaults to last 7 days.
 */
function parseDateRange(query) {
  const now = new Date();
  const to = query.to ? new Date(query.to) : now;
  const from = query.from ? new Date(query.from) : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { from, to };
}

/**
 * GET /api/analytics/overview?from=YYYY-MM-DD&to=YYYY-MM-DD
 * returns: { total, avgAll, negativePct }
 * - Uses stars if present, else sentiment.mappedStars.
 */
export async function getOverview(req, res) {
  try {
    const { from, to } = parseDateRange(req.query);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: from, $lt: to }
        }
      },
      {
        $addFields: {
          effStars: { $ifNull: ['$stars', '$sentiment.mappedStars'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgAll: { $avg: '$effStars' },
          negative: {
            $sum: {
              $cond: [{ $lte: ['$effStars', 2] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          avgAll: { $ifNull: ['$avgAll', 0] },
          negativePct: {
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$negative', '$total'] }, 100] },
              0
            ]
          }
        }
      }
    ];

    const [doc] = await Feedback.aggregate(pipeline);
    res.json(doc || { total: 0, avgAll: 0, negativePct: 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'overview_failed' });
  }
}

/**
 * GET /api/analytics/risky-drivers?minCount=10&limit=10
 * Sorted by stats.avg ascending. Only include drivers with feedback count >= minCount.
 */
export async function getTopRiskyDrivers(req, res) {
  try {
    const minCount = Math.max(parseInt(req.query.minCount ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '20', 30), 1), 100);

    const drivers = await Driver.find({
      'stats.n': { $gte: minCount },
      'stats.avg': { $gte: 1 }   // ✅ ensure minimum rating is 1
    })
      .sort({ 'stats.avg': 1 })  // lowest avg first (risky drivers)
      .limit(limit)
      .select('name phone stats.n stats.avg stats.lastUpdatedAt')
      .lean();

    res.json({ items: drivers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'risky_drivers_failed' });
  }
}


/**
 * GET /api/analytics/driver/:id/timeseries?days=30
 * Buckets by day, returns [{ date: 'YYYY-MM-DD', avg, n }]
 */
// export async function getDriverTimeseries(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'invalid_driver_id' });
//     }
//     const days = Math.max(parseInt(req.query.days ?? '30', 10), 1);
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

//     const pipeline = [
//       { $match: { driverId: new mongoose.Types.ObjectId(id), createdAt: { $gte: since } } },
//       { $addFields: { effStars: { $ifNull: ['$stars', '$sentiment.mappedStars'] } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           avg: { $avg: '$effStars' },
//           n: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } },
//       { $project: { _id: 0, date: '$_id', avg: 1, n: 1 } }
//     ];

//     const rows = await Feedback.aggregate(pipeline);
//     res.json({ items: rows });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'driver_timeseries_failed' });
//   }
// }

export async function getDriverTimeseries(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'invalid_driver_id' });
    }

    const count = Math.min(Math.max(parseInt(req.query.count ?? '50', 10), 1), 500);

    const rows = await Feedback.aggregate([
      { $match: { driverId: new mongoose.Types.ObjectId(id) } },
      { $sort: { createdAt: -1 } },
      { $limit: count },
      { $set: { effStars: { $ifNull: ['$stars', '$sentiment.mappedStars'] } } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          stars: '$effStars',
          // keep whatever else you need:
          text: 1,
          userId: 1
        }
      },
      // optional: return ascending for charts
      { $sort: { createdAt: 1 } },
    ]);

    res.json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'driver_recent_feedback_failed' });
  }
}


/**
 * GET /api/analytics/distribution?from=&to=
 * Sentiment label distribution in range.
 */
export async function getSentimentDistribution(req, res) {
  try {
    const { from, to } = parseDateRange(req.query);
    const pipeline = [
      { $match: { createdAt: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: '$sentiment.label',
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, label: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    ];
    const rows = await Feedback.aggregate(pipeline);
    res.json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'distribution_failed' });
  }
}
