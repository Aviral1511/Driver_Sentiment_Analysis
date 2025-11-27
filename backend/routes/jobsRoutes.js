import { Router } from 'express';
import { listJobs, retryJob, purgeDone } from '../controllers/jobsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/jobs?status=queued|processing|done|failed&limit=50
router.get('/', requireAuth, requireRole('admin'), listJobs);

// POST /api/jobs/:id/retry
router.post('/:id/retry', requireAuth, requireRole('admin'), retryJob);

// DELETE /api/jobs/purge?days=7
router.delete('/purge', requireAuth, requireRole('admin'), purgeDone);

export default router;
