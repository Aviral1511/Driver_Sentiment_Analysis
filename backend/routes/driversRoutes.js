import { Router } from 'express';
import { listDrivers, searchDrivers, getDriverById } from '../controllers/driversController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /drivers?page=&limit=
router.get('/', requireAuth, listDrivers);

// GET /drivers/search?q=
router.get('/search', requireAuth, searchDrivers);

// GET /drivers/:id
router.get('/:id', requireAuth, getDriverById);

export default router;
