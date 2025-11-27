import { Router } from 'express';
import {
  getRecentAlerts,
  getDriverAlerts,
  getAlertLocks,
  muteDriverAlerts,
  unmuteDriverAlerts,
} from '../controllers/alertController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/alerts/recent?limit=50&driverId=<id>
router.get('/recent', requireAuth, getRecentAlerts);

// GET /api/alerts/driver/:id
router.get('/driver/:id', requireAuth, getDriverAlerts);

// GET /api/alerts/locks?driverId=<id>
router.get('/locks', requireAuth, getAlertLocks);

// POST /api/alerts/mute/:driverId?minutes=60
router.post('/mute/:driverId', requireAuth, requireRole('admin'), muteDriverAlerts);

// DELETE /api/alerts/mute/:driverId
router.delete('/mute/:driverId', requireAuth, requireRole('admin'), unmuteDriverAlerts);

export default router;
