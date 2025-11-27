import mongoose from 'mongoose';
import Driver from '../models/Driver.js';

export async function applyIncrementalUpdate(driverId, mappedStars) {
  const _id = new mongoose.Types.ObjectId(driverId);

  await Driver.updateOne(
    { _id },
    [
      {
        $set: {
          'stats.n':   { $add: [ { $ifNull: ['$stats.n', 0] }, 1 ] },
          'stats.sum': { $add: [ { $ifNull: ['$stats.sum', 0] }, mappedStars ] },
          'stats.lastUpdatedAt': new Date()
        }
      },
      {
        $set: {
          'stats.avg': {
            $cond: [
              { $gt: ['$stats.n', 0] },
              { $divide: ['$stats.sum', '$stats.n'] },
              0
            ]
          }
        }
      }
    ],
    { upsert: true }
  );

  const d = await Driver.findById(_id).select('stats.avg').lean();
  return d?.stats?.avg ?? 0;
}
