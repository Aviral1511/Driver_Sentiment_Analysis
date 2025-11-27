import { Router } from 'express';
import {
  workerStatus,
  workerRunOnce,
  workerPause,
  workerResume
} from '../controllers/workerController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/worker/status
router.get('/status', requireAuth, requireRole('admin'), workerStatus);

// POST /api/worker/run-once  (process exactly one job now)
router.post('/run-once', requireAuth, requireRole('admin'), workerRunOnce);

// POST /api/worker/pause
router.post('/pause', requireAuth, requireRole('admin'), workerPause);

// POST /api/worker/resume
router.post('/resume', requireAuth, requireRole('admin'), workerResume);

export default router;
