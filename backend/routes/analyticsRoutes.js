import { Router } from 'express';
import {
  getOverview,
  getTopRiskyDrivers,
  getDriverTimeseries,
  getSentimentDistribution
} from '../controllers/analyticsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// /api/analytics/overview?from=2025-11-01&to=2025-11-09
router.get('/overview', getOverview);

// /api/analytics/risky-drivers?minCount=10&limit=10
router.get('/risky-drivers', requireAuth, requireRole('admin'), getTopRiskyDrivers);

// /api/analytics/driver/:id/timeseries?days=30
router.get('/driver/:id/timeseries', requireAuth, getDriverTimeseries);

// /api/analytics/distribution?from=&to=
router.get('/distribution', requireAuth, requireRole('admin'), getSentimentDistribution);

export default router;
