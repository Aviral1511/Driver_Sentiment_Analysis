// backend/middleware/auth.js
import { verifyJwt } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });

  try {
    const payload = verifyJwt(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
