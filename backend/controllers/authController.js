// backend/controllers/authController.js
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signJwt } from '../utils/jwt.js';

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user: { _id, name, email, role } }
 */
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'missing_credentials' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
  if (!user) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const ok = await bcrypt.compare(password, user.hash);
  if (!ok) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const token = signJwt({ sub: user._id, role: user.role, email: user.email });

  // send a trimmed user object
  const { _id, name, role } = user;
  res.json({ token, user: { _id, name, email: user.email, role } });
}

/**
 * (Optional) POST /api/auth/register
 * Quickly create a user; helpful during dev. You can delete later.
 */
export async function register(req, res) {
  const { name, email, password, role = 'rider' } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(409).json({ error: 'email_in_use' });

  const hash = await bcrypt.hash(password, 10);
  const doc = await User.create({ name, email: String(email).toLowerCase().trim(), hash, role });
  res.status(201).json({ _id: doc._id, email: doc.email, role: doc.role });
}
/**
 * GET /api/auth/me (protected)
 */
export async function me(req, res) {
  // req.user is set by middleware
  return res.json({ user: req.user });
}
