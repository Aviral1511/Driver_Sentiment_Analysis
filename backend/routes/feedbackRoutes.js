import { Router } from 'express';
import { postFeedback } from '../controllers/feedbackController.js';
import { getFeedbackByDriver } from '../controllers/feedbackController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, postFeedback);
router.get('/driver/:id', requireAuth, getFeedbackByDriver);

export default router;
