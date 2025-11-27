import { Router } from 'express';
import { debugAnalyze, classify } from '../controllers/sentimentController.js';
import { requireAuth } from '../middleware/auth.js';
// If you want to restrict later: import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// For quick testing in dev:
router.get('/debug', debugAnalyze);   // GET /api/sentiment/debug?text=...
router.post('/classify', classify);   // POST /api/sentiment/classify { text, stars? }

export default router;
