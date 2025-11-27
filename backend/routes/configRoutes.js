import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/configController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), getConfig);
router.put('/', requireAuth, requireRole('admin'), updateConfig);

export default router;
