import { Router } from 'express';
import { login, register, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// dev helper: create users
router.post('/register', register);

// real login
router.post('/login', login);

// verify token / get current user
router.get('/me', requireAuth, me);

export default router;
